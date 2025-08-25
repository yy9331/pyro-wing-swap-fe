import { useReadContract } from 'wagmi'
import { FACTORY_ADDRESS, TEST_TOKENS, ZERO_ADDRESS } from '@/lib/constants'
import { factoryAbi, pairAbi, erc20Abi, publicClient } from '@/lib/contract'
import { formatEther, parseEther, parseAbi, formatUnits } from 'viem'
import { useState, useEffect } from 'react'

export interface PoolData {
  token0: string
  token1: string
  reserve0: string
  reserve1: string
  totalSupply: string
  tvl: number
  volume24h: number
  apr: number
  dailyFees: number // 日手续费收入
  lpTokens: number
  exists: boolean
  isLoading: boolean // New loading state 新增加载状态
}

export function usePoolData(tokenA: string, tokenB: string): PoolData {
  const [volume24h, setVolume24h] = useState(0)
  const [apr, setApr] = useState(0)
  const [dailyFees, setDailyFees] = useState(0) // 日手续费收入
  const [isLoading, setIsLoading] = useState(true) // New loading state 新增加载状态

  // Get pair address 获取 pair 地址
  // Why pairAddress might be undefined multiple times: 为什么 pairAddress 会多次出现 undefined：
  // 1. React Strict Mode in development: React 开发模式下的严格模式会重复执行组件
  // 2. Wagmi's async loading mechanism: Wagmi 的异步加载机制
  // 3. Dependency changes trigger re-execution: 依赖项变化触发重新执行
  const { data: pairAddress, isLoading: isPairAddressLoading,error: pairAddressError } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: factoryAbi,
    functionName: 'getPair',
    args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
  })

  // Read pair contract data 读取 pair 合约数据
  // This will be undefined until pairAddress is available 在 pairAddress 可用之前会是 undefined
  const { data: pairData, isLoading: isPairDataLoading,error: pairDataError } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: pairAbi,
    functionName: 'getReserves',
    query: {
      enabled: !!pairAddress && pairAddress !== ZERO_ADDRESS, // Only execute when pairAddress is valid 只在 pairAddress 有效时执行
    },
  })

  // Read token0 and token1 读取 token0 和 token1
  // These calls depend on pairAddress being available 这些调用依赖于 pairAddress 可用
  const { data: token0, isLoading: isToken0Loading,error: token0Error } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: pairAbi,
    functionName: 'token0',
    query: {
      enabled: !!pairAddress && pairAddress !== ZERO_ADDRESS,
    },
  })

  // Read LP token total supply 读取 LP 代币总量
  const { data: totalSupply, isLoading: isTotalSupplyLoading,error: totalSupplyError } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: pairAbi,
    functionName: 'totalSupply',
    query: {
      enabled: !!pairAddress && pairAddress !== ZERO_ADDRESS,
    },
  })

  // Update loading state 更新加载状态
  // Add loading state reasons: 添加 loading 状态的理由:
  // 1. Better UX: Show loading indicator instead of empty data 更好的用户体验：显示加载指示器而不是空数据
  // 2. Prevent false "pool doesn't exist" messages 防止错误的"池子不存在"消息
  // 3. Handle React's Strict Mode multiple re-renders gracefully 优雅处理 React 严格模式的多次重新渲染
  useEffect(() => {
    // Loading is true when: 加载状态为 true 的情况：
    // - pairAddress is still loading 或 pairAddress 仍在加载中
    // - pairAddress exists but dependent data is loading 或 pairAddress 存在但依赖数据仍在加载中
    const loading = isPairAddressLoading || 
                   (!!pairAddress && pairAddress !== ZERO_ADDRESS && 
                    (isPairDataLoading || isToken0Loading || isTotalSupplyLoading))
    setIsLoading(loading)
  }, [isPairAddressLoading, isPairDataLoading, isToken0Loading, isTotalSupplyLoading, pairAddress])

  // Async calculation for 24h volume and APR 异步计算 24h 成交量和 APR
  useEffect(() => {
    if (!pairAddress || pairAddress === ZERO_ADDRESS || !pairData || !token0 || !totalSupply) {
      setVolume24h(0)
      setApr(0)
      return
    }

    const [reserve0, reserve1, blockTimestampLast] = pairData

    // 3rd elements in pairData is blockTimestampLast, which is the last block timestamp of the pair
    console.log('blockTimestampLast', blockTimestampLast) // 1755657540

    // token0 from chain, all words of hash is uppercase
    // tokenA from UI, all words of hash is lowercase
    console.log(token0, tokenA)// 0x8984B52EF3aEcF95Bf9832b00C95868d075F5609 0x8984b52ef3aecf95bf9832b00c95868d075f5609

    // Determine which is tokenA and which is tokenB 确定哪个是 tokenA，哪个是 tokenB
    // token0 from chain; tokenA from UI, but tokenA might not be 100% match the token0, so it must be judge the tokenA and token0
    // token0 是合约里的代币, tokenA 是用户选择的代币, 可能不一致, 所以需要判断 tokenA 和 token0 是否一致
    const isTokenAFirst = tokenA === token0.toLowerCase()
    const reserveA = isTokenAFirst ? reserve0 : reserve1
    const reserveB = isTokenAFirst ? reserve1 : reserve0
  
    // Get token information 获取代币信息
    const tokenAInfo = Object.values(TEST_TOKENS).find(t => t.address === tokenA)
    const tokenBInfo = Object.values(TEST_TOKENS).find(t => t.address === tokenB)
    
    if (!tokenAInfo || !tokenBInfo) {
      setVolume24h(0)
      setApr(0)
      return
    }

    const calculateVolumeAndAPR = async () => {
      const reserveAFormatted = parseFloat(formatUnits(reserveA, tokenAInfo.decimals))
      const reserveBFormatted = parseFloat(formatUnits(reserveB, tokenBInfo.decimals))
      /**
       * totalSupply: LP token total supply of the pair (the ERC-20 supply for LP tokens), always 18 decimals in V2. It’s NOT the amount of tokenA/tokenB in the pool. 
       * totalSupply 是 LP 代币的“发行总量”，对应配对合约里的 LP ERC-20，总是 18 位小数；它不是池子里 tokenA/tokenB 的储备数量。
       * starts as sqrt(reserve0 * reserve1) − MINIMUM_LIQUIDITY (locked 1000) in 18 decimals 
       * 初始铸造规则（Uniswap V2 风格）：totalSupply ≈ sqrt(reserve0 * reserve1) − MINIMUM_LIQUIDITY（通常锁定 1000），之后随着增减流动性按比例增减。
       * 
       * Useful relations: 常用关系：
       * User share: share = userLp / totalSupply 用户份额 share = userLp / totalSupply
       * Underlying claim: amount0 = share * reserve0, amount1 = share * reserve1 可赎回底层资产：amount0 = share * reserve0，amount1 = share * reserve1
       * LP price in tokenA: lpPriceInA = tvlInA / totalSupplyFormatted LP 以 tokenA 计价的单价：lpPriceInA = tvlInA / totalSupplyFormatted
       */
      const totalSupplyFormatted = parseFloat(formatUnits(totalSupply, 18))
      console.log(reserveAFormatted, reserveBFormatted, totalSupplyFormatted)// 37045.85552235257 63075.164797624144 48337.14901997206

      // Use current mid-price valuation (priced in tokenA) 使用当前中间价估值（以 tokenA 计价）
      const priceAinB = reserveA > 0n ? Number(reserveB) / Number(reserveA) : 0
      const priceBinA = reserveB > 0n ? Number(reserveA) / Number(reserveB) : 0
      console.log(priceBinA, priceAinB) // 0.5873287155287461 1.7026240562744224

      // TVL priced in tokenA: A + B converted at current mid-price TVL 以 tokenA 计价：A + B 按当前中价折算
      const tvlInA = reserveAFormatted + reserveBFormatted * priceBinA
      // 例如上面的得出的值的计算：37045 + 63075 * 0.587 = 37045 + 37045 = 74090
      // A 代币总量(reserveA) + B 代币总量(reserveB) * (B 代币单价(priceBinA), 即1个B 换几个 A)
      
      // Get real 24h volume from Redis cache or database
      // 从Redis缓存或数据库获取真实的24小时交易量
      let volume24hInA = 0
      
      try {
        // Try to get from Redis cache first
        // 首先尝试从Redis缓存获取
        const response = await fetch(`/api/pool-volume/${pairAddress}`)
        if (response.ok) {
          const data = await response.json()
          
          // Convert both token volumes from wei to token units
          // 将两个代币的交易量从wei转换为代币单位
          const volumeAInWei = BigInt(data.volume24h_a || 0)
          const volumeBInWei = BigInt(data.volume24h_b || 0)
          
          const volumeA = parseFloat(formatUnits(volumeAInWei, tokenAInfo.decimals))
          const volumeB = parseFloat(formatUnits(volumeBInWei, tokenBInfo.decimals))
          
          // Calculate total volume in tokenA terms (A + B converted at current price)
          // 计算以tokenA计价的总交易量（A + B按当前价格转换）
          const totalVolumeInA = volumeA + volumeB * priceBinA
          volume24hInA = totalVolumeInA
        } else {
          // Fallback to estimated calculation if cache miss
          // 如果缓存未命中，回退到估算计算
          volume24hInA = tvlInA * 0.1
        }
      } catch (error) {
        console.error('Error fetching 24h volume:', error)
        // Fallback to estimated calculation on error
        // 出错时回退到估算计算
        volume24hInA = tvlInA * 0.1
      }

      // Fee rate (common v2 0.3%) 手续费率（v2 常见 0.3%）
      const feeRate = 0.003
      const fees24hInA = volume24hInA * feeRate
      
      // Calculate APR with proper bounds to avoid extreme values
      // 计算APR时设置合理的边界以避免极端值
      let calculatedApr = 0
      let calculatedDailyFees = fees24hInA
      
      if (tvlInA > 0 && volume24hInA > 0) {
        const dailyReturn = fees24hInA / tvlInA
        calculatedApr = dailyReturn * 365 * 100
        
        // Cap APR at reasonable maximum (e.g., 1000%)
        // 将APR限制在合理最大值内（例如1000%）
        calculatedApr = Math.min(calculatedApr, 1000)
      }

      setVolume24h(parseFloat(volume24hInA.toFixed(2)))
      setApr(parseFloat(calculatedApr.toFixed(2)))
      setDailyFees(parseFloat(calculatedDailyFees.toFixed(2)))
    }

    calculateVolumeAndAPR()
  }, [pairAddress, pairData, token0, totalSupply, tokenA, tokenB])

  // Calculate basic pool data 计算基础池子数据
  if (pairAddress && pairAddress !== ZERO_ADDRESS && pairData && token0 && totalSupply) {
    const [reserve0, reserve1] = pairData
    const token0Address = token0 as string
    
    // Determine which is tokenA and which is tokenB 确定哪个是 tokenA，哪个是 tokenB
    const isTokenAFirst = tokenA.toLowerCase() === token0Address.toLowerCase()
    const reserveA = isTokenAFirst ? reserve0 : reserve1
    const reserveB = isTokenAFirst ? reserve1 : reserve0
    
    // Get token information 获取代币信息
    const tokenAInfo = Object.values(TEST_TOKENS).find(t => t.address.toLowerCase() === tokenA.toLowerCase())
    const tokenBInfo = Object.values(TEST_TOKENS).find(t => t.address.toLowerCase() === tokenB.toLowerCase())
    
    if (tokenAInfo && tokenBInfo) {
      const reserveAFormatted = parseFloat(formatUnits(reserveA, tokenAInfo.decimals))
      const reserveBFormatted = parseFloat(formatUnits(reserveB, tokenBInfo.decimals))
      const totalSupplyFormatted = parseFloat(formatUnits(totalSupply, 18))

      // Use current mid-price valuation (priced in tokenA) 使用当前中间价估值（以 tokenA 计价）
      const priceAinB = reserveA > 0n ? Number(reserveB) / Number(reserveA) : 0
      const priceBinA = reserveB > 0n ? Number(reserveA) / Number(reserveB) : 0

      // TVL priced in tokenA: A + B converted at current mid-price TVL 以 tokenA 计价：A + B 按当前中价折算
      const tvlInA = reserveAFormatted + reserveBFormatted * priceBinA
      
      return {
        token0: tokenA,
        token1: tokenB,
        reserve0: reserveAFormatted.toFixed(2),
        reserve1: reserveBFormatted.toFixed(2),
        totalSupply: totalSupplyFormatted.toFixed(2),
        tvl: parseFloat(tvlInA.toFixed(2)),
        volume24h,
        apr,
        dailyFees,
        lpTokens: parseFloat(totalSupplyFormatted.toFixed(2)),
        exists: true,
        isLoading: false, // Data loading completed 数据加载完成
      }
    }
  }

  // If pairAddress is ZERO_ADDRESS, pool doesn't exist 如果 pairAddress 是 ZERO_ADDRESS，说明池子不存在
  const poolExists = pairAddress && pairAddress !== ZERO_ADDRESS

  return {
    token0: tokenA,
    token1: tokenB,
    reserve0: '0',
    reserve1: '0',
    totalSupply: '0',
    tvl: 0,
    volume24h: 0,
    apr: 0,
    dailyFees: 0,
    lpTokens: 0,
    exists: Boolean(poolExists && !isLoading), /* Only return true when loading is complete and pool exists 只有在加载完成且池子存在时才返回 true */
    isLoading: Boolean(isLoading), /* Return loading state 返回加载状态 */
  }
}
