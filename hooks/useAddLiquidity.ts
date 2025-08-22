'use client'

import { useEffect, useMemo, useState } from 'react'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { erc20Abi, factoryAbi, pairAbi, publicClient, routerAbi } from '@/lib/contract'
import { FACTORY_ADDRESS, ROUTER_ADDRESS, TEST_TOKENS } from '@/lib/constants'

export type TokenMeta = typeof TEST_TOKENS.PW

export interface PoolInfo {
  exists: boolean
  reserve0: bigint
  reserve1: bigint
  totalSupply: bigint
}

export function useAddLiquidity() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const [mounted, setMounted] = useState(false)
  const [token0, setToken0] = useState(TEST_TOKENS.PW)
  const [token1, setToken1] = useState(TEST_TOKENS.FLF)
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null)
  const [balance0, setBalance0] = useState<bigint>(0n)
  const [balance1, setBalance1] = useState<bigint>(0n)
  const [pairAddress, setPairAddress] = useState<Address | null>(null)
  const [lpBalance, setLpBalance] = useState<bigint>(0n)

  useEffect(() => setMounted(true), [])

  const getPoolInfo = async () => {
    try {
      const pairAddr = await publicClient.readContract({
        address: FACTORY_ADDRESS as Address,
        abi: factoryAbi,
        functionName: 'getPair',
        args: [token0.address as Address, token1.address as Address],
      }) as Address

      if (pairAddr === '0x0000000000000000000000000000000000000000') {
        setPoolInfo({ exists: false, reserve0: 0n, reserve1: 0n, totalSupply: 0n })
        setPairAddress(null)
        setLpBalance(0n)
        return
      }

      const reserves = await publicClient.readContract({
        address: pairAddr,
        abi: pairAbi,
        functionName: 'getReserves',
      }) as [bigint, bigint, number]

      const totalSupply = await publicClient.readContract({
        address: pairAddr,
        abi: pairAbi,
        functionName: 'totalSupply',
      }) as bigint

      // 获取合约中的 token0 地址，用于确定储备量的顺序
      const contractToken0 = await publicClient.readContract({
        address: pairAddr,
        abi: pairAbi,
        functionName: 'token0',
      }) as Address

      // 根据当前用户界面中的代币顺序来调整储备量
      let adjustedReserve0: bigint
      let adjustedReserve1: bigint
      
      if (token0.address.toLowerCase() === contractToken0.toLowerCase()) {
        // 用户界面中的 token0 就是合约中的 token0
        adjustedReserve0 = reserves[0]
        adjustedReserve1 = reserves[1]
      } else {
        // 用户界面中的 token0 是合约中的 token1，需要交换储备量
        adjustedReserve0 = reserves[1]
        adjustedReserve1 = reserves[0]
      }

      setPoolInfo({ exists: true, reserve0: adjustedReserve0, reserve1: adjustedReserve1, totalSupply })
      setPairAddress(pairAddr)
      if (address) {
        try {
          const bal = await publicClient.readContract({
            address: pairAddr,
            abi: pairAbi,
            functionName: 'balanceOf',
            args: [address as Address],
          }) as bigint
          setLpBalance(bal)
        } catch {}
      }
    } catch (e) {
      setPoolInfo({ exists: false, reserve0: 0n, reserve1: 0n, totalSupply: 0n })
      setPairAddress(null)
      setLpBalance(0n)
    }
  }

  const calculateTokenAmount = (inputAmount: string, isToken0: boolean) => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) return ''
    try {
      const amount = parseFloat(inputAmount)
      
      // 检查是否为新池子（不存在或储备为0）
      const isNewPool = !poolInfo?.exists || (poolInfo.reserve0 === 0n && poolInfo.reserve1 === 0n)
      
      if (isNewPool) {
        // 新池子时，不自动计算比例，返回空字符串让用户手动输入
        return ''
      }
      
      // 获取当前显示顺序下的储备量
      const currentReserve0 = Number(formatUnits(poolInfo.reserve0, token0.decimals))
      const currentReserve1 = Number(formatUnits(poolInfo.reserve1, token1.decimals))
      
      if (currentReserve0 === 0 || currentReserve1 === 0) return ''
      
      // 计算当前显示顺序下的比率
      const currentRatio = currentReserve1 / currentReserve0
      
      // 根据输入的是哪个代币来计算另一个代币的数量
      if (isToken0) {
        // 输入的是 token0，计算需要多少 token1
        return (amount * currentRatio).toFixed(6)
      } else {
        // 输入的是 token1，计算需要多少 token0
        return (amount / currentRatio).toFixed(6)
      }
    } catch {
      return ''
    }
  }

  const handleAmountChange = (value: string, which: 'amount0' | 'amount1') => {
    setError(null)
    setSuccess(null)
    
    // 检查是否为新池子（不存在或储备为0）
    const isNewPool = !poolInfo?.exists || (poolInfo.reserve0 === 0n && poolInfo.reserve1 === 0n)
    
    if (isNewPool) {
      // 新池子时，让用户自由输入，不自动计算比例
      if (which === 'amount0') {
        setAmount0(value)
        // 不自动设置 amount1，让用户手动输入
      } else {
        setAmount1(value)
        // 不自动设置 amount0，让用户手动输入
      }
    } else {
      // 已存在的池子，按比例计算
      if (which === 'amount0') {
        setAmount0(value)
        setAmount1(calculateTokenAmount(value, true))
      } else {
        setAmount1(value)
        setAmount0(calculateTokenAmount(value, false))
      }
    }
  }

  const getBalances = async () => {
    if (!address) return
    try {
      const [bal0, bal1] = await Promise.all([
        publicClient.readContract({ address: token0.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address] }),
        publicClient.readContract({ address: token1.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address] }),
      ])
      setBalance0(bal0 as bigint)
      setBalance1(bal1 as bigint)
    } catch {}
  }

  const setMaxAmount = (which: 'amount0' | 'amount1') => {
    setError(null)
    setSuccess(null)
    if (which === 'amount0') {
      handleAmountChange(formatUnits(balance0, token0.decimals), 'amount0')
    } else {
      handleAmountChange(formatUnits(balance1, token1.decimals), 'amount1')
    }
  }

  useEffect(() => {
    if (mounted && isConnected) {
      getPoolInfo()
      getBalances()
    }
  }, [mounted, isConnected, token0.address, token1.address])

  const handleAddLiquidity = async () => {
    if (!isConnected || !address) { setError('请先连接钱包'); return }
    if (!amount0 || !amount1) { setError('请输入代币数量'); return }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      // 代币1 空格输入的代币数量
      const amtA = parseUnits(amount0, token0.decimals)
      // 代币2 空格输入的代币数量
      const amtB = parseUnits(amount1, token1.decimals)
      // bps, 参考 pyrowindswap-fe/components/SwapInterface.tsx 里的 bps 定义及注释
      const bps = Math.max(0, Math.floor(Number(slippage || '0.5') * 100))
      // 代币1 滑点后的最小输出量
      const amountAMin = (amtA * BigInt(10000 - bps)) / 10000n
      // 代币2 滑点后的最小输出量
      const amountBMin = (amtB * BigInt(10000 - bps)) / 10000n
      // 交易截止时间, 20分钟后的时间戳
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

      // 获取代币 A和 代币B 余额
      const [balanceA, balanceB] = await Promise.all([
        publicClient.readContract({ address: token0.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address] }),
        publicClient.readContract({ address: token1.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address] }),
      ])
      if ((balanceA as bigint) < amtA) throw new Error(`${token0.symbol} 余额不足: 需要 ${amtA}, 拥有 ${balanceA}`)
      if ((balanceB as bigint) < amtB) throw new Error(`${token1.symbol} 余额不足: 需要 ${amtB}, 拥有 ${balanceB}`)

      // 获取代币 A和 代币B 授权额度
      const [allowanceA, allowanceB] = await Promise.all([
        publicClient.readContract({ address: token0.address as Address, abi: erc20Abi, functionName: 'allowance', args: [address as Address, ROUTER_ADDRESS as Address] }),
        publicClient.readContract({ address: token1.address as Address, abi: erc20Abi, functionName: 'allowance', args: [address as Address, ROUTER_ADDRESS as Address] }),
      ])

      // 如果代币 A 的授权额度不足, 则授权, 但该步骤会消耗 Gas 费用
      if ((allowanceA as bigint) < amtA) {
        const hashApproveA = await writeContractAsync({ abi: erc20Abi, address: token0.address as Address, functionName: 'approve', args: [ROUTER_ADDRESS as Address, amtA] })
        const receiptA = await publicClient.waitForTransactionReceipt({ hash: hashApproveA })
        if (receiptA.status === 'reverted') {
          throw new Error(`${token0.symbol} 授权失败`)
        }
      }
      // 如果代币 B 的授权额度不足, 则授权, 但该步骤会消耗 Gas 费用
      if ((allowanceB as bigint) < amtB) {
        const hashApproveB = await writeContractAsync({ abi: erc20Abi, address: token1.address as Address, functionName: 'approve', args: [ROUTER_ADDRESS as Address, amtB] })
        const receiptB = await publicClient.waitForTransactionReceipt({ hash: hashApproveB })
        if (receiptB.status === 'reverted') {
          throw new Error(`${token1.symbol} 授权失败`)
        }
      }

      try {
        // 检查 Router 合约的 Factory 地址是否正确
        const routerFactory = await publicClient.readContract({ address: ROUTER_ADDRESS as Address, abi: routerAbi, functionName: 'factory' }) as Address
        if (routerFactory.toLowerCase() !== FACTORY_ADDRESS.toLowerCase()) {
          throw new Error('Router 合约的 Factory 地址配置错误')
        }
      } catch {
        throw new Error('Router 合约配置有问题，请检查部署')
      }

      // 添加流动性成功后, 返回相应的交易哈希 txHash
      const txHash = await writeContractAsync({
        abi: routerAbi,
        address: ROUTER_ADDRESS as Address,
        functionName: 'addLiquidity',
        args: [token0.address as Address, token1.address as Address, amtA, amtB, amountAMin, amountBMin, address as Address, deadline],
      })
      
      // 等待交易收据并验证交易状态
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
      
      // 检查交易是否成功执行
      if (receipt.status === 'reverted') {
        throw new Error('交易执行失败，合约可能回滚了交易')
      }

      setSuccess(`添加流动性成功！交易哈希: ${txHash}`)
      setAmount0('')
      setAmount1('')
      await Promise.all([getPoolInfo(), getBalances()])
    } catch (e) {
      let errorMessage = '未知错误'
      if (e instanceof Error) {
        errorMessage = e.message
        if (errorMessage.includes('execution reverted')) {
          errorMessage = '合约执行失败，可能是 Router 合约有问题'
        } else if (errorMessage.includes('交易执行失败')) {
          errorMessage = '交易执行失败，合约可能回滚了交易'
        } else if (errorMessage.includes('授权失败')) {
          errorMessage = errorMessage // 保持具体的授权失败信息
        } else if (errorMessage.toLowerCase().includes('circuit breaker is open')) {
          errorMessage = '节点刚刚出现超时/异常，已触发断路器保护，请等待约 30 秒或刷新页面后重试'
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = '余额不足'
        } else if (errorMessage.includes('user rejected')) {
          errorMessage = '用户取消了交易'
        } else if (errorMessage.includes('nonce too low')) {
          errorMessage = 'Nonce 错误，请重置 MetaMask 账户'
        }
      }
      setError(`交易失败: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  return useMemo(() => ({
    token0, token1,
    amount0, amount1,
    slippage, setSlippage,
    balance0, balance1,
    poolInfo,
    submitting,
    error, setError,
    success, setSuccess,
    handleAmountChange,
    setMaxAmount,
    handleAddLiquidity,
    isConnected,
    pairAddress,
    lpBalance,
    positionShare: poolInfo && poolInfo.totalSupply > 0n ? Number(lpBalance) / Number(poolInfo.totalSupply) : 0,
    underlying0: poolInfo && poolInfo.totalSupply > 0n ? (poolInfo.reserve0 * lpBalance) / poolInfo.totalSupply : 0n,
    underlying1: poolInfo && poolInfo.totalSupply > 0n ? (poolInfo.reserve1 * lpBalance) / poolInfo.totalSupply : 0n,
    setToken0,
    setToken1,
    mounted,
  }), [token0, token1, amount0, amount1, slippage, balance0, balance1, poolInfo, submitting, error, success, isConnected, pairAddress, lpBalance, mounted])

}


