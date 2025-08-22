import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Address, parseUnits } from 'viem'
import { TEST_TOKENS, ROUTER_ADDRESS } from '@/lib/constants'
import { erc20Abi, publicClient, routerAbi } from '@/lib/contract'
import { quoteOut, getPairInfo, quoteIn } from '@/lib/amm'
import { useTokenBalance } from '@/hooks/useTokenBalance'

export function useSwap() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  
  // State management
  const [fromToken, setFromToken] = useState(TEST_TOKENS.PW)
  const [toToken, setToToken] = useState(TEST_TOKENS.FLF)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [pairReady, setPairReady] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<'from' | 'to'>('from')
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)
  const [txSuccess, setTxSuccess] = useState<string | null>(null)
  const [slippage, setSlippage] = useState('0.5')

  // Token balances
  const pwBalance = useTokenBalance('PW', address, isConnected)
  const flfBalance = useTokenBalance('FLF', address, isConnected)
  const ddlBalance = useTokenBalance('DDL', address, isConnected)

  // Ensure client-side rendering only
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if pair exists with reserves
  useEffect(() => {
    if (!mounted) return
    let alive = true
    ;(async () => {
      const info = await getPairInfo(fromToken.address as `0x${string}`, toToken.address as `0x${string}`)
      if (alive) setPairReady(info.ok)
    })()
    return () => { alive = false }
  }, [mounted, fromToken.address, toToken.address])

  // Quote calculation (from -> to)
  useEffect(() => {
    if (!mounted || activeField !== 'from') return
    let alive = true
    const t = setTimeout(async () => {
      if (!fromAmount) {
        if (alive) { setToAmount(''); setQuoteError(null) }
        return
      }
      setLoadingQuote(true)
      try {
        const { amountOut, reason } = await quoteOut({
          amountIn: fromAmount,
          fromSymbol: fromToken.symbol as keyof typeof TEST_TOKENS,
          toSymbol: toToken.symbol as keyof typeof TEST_TOKENS,
        })
        if (alive) { setToAmount(amountOut); setQuoteError(reason ?? null) }
      } catch { if (alive) setToAmount('') }
      finally { if (alive) setLoadingQuote(false) }
    }, 300)
    return () => { alive = false; clearTimeout(t) }
  }, [mounted, activeField, fromAmount, fromToken.symbol, toToken.symbol])

  // Reverse quote calculation (to -> from)
  useEffect(() => {
    if (!mounted || activeField !== 'to') return
    let alive = true
    const t = setTimeout(async () => {
      if (!toAmount) {
        if (alive) { setFromAmount(''); setQuoteError(null) }
        return
      }
      setLoadingQuote(true)
      try {
        const { amountIn, reason } = await quoteIn({
          amountOut: toAmount,
          fromSymbol: fromToken.symbol as keyof typeof TEST_TOKENS,
          toSymbol: toToken.symbol as keyof typeof TEST_TOKENS,
        })
        if (alive) { setFromAmount(amountIn); setQuoteError(reason ?? null) }
      } catch { if (alive) setFromAmount('') }
      finally { if (alive) setLoadingQuote(false) }
    }, 300)
    return () => { alive = false; clearTimeout(t) }
  }, [mounted, activeField, toAmount, fromToken.symbol, toToken.symbol])

  // Get current balance based on fromToken
  const getCurrentBalance = () => {
    if (fromToken.symbol === 'PW') return { balance: pwBalance.balance, formatted: pwBalance.formattedBalance, isLoading: pwBalance.isLoading }
    if (fromToken.symbol === 'FLF') return { balance: flfBalance.balance, formatted: flfBalance.formattedBalance, isLoading: flfBalance.isLoading }
    if (fromToken.symbol === 'DDL') return { balance: ddlBalance.balance, formatted: ddlBalance.formattedBalance, isLoading: ddlBalance.isLoading }
    return { balance: 0n, formatted: 0, isLoading: false }
  }

  const currentBalance = getCurrentBalance()

  // Set maximum amount
  const handleMax = () => {
    if (!isConnected) return
    if (currentBalance.formatted > 0) setFromAmount(String(currentBalance.formatted))
  }

  // Main swap function
  const handleSwap = async () => {
    setTxError(null)
    setTxSuccess(null)
    try {
      if (!isConnected || !address) {
        setTxError('请先连接钱包')
        return
      }
      if (!pairReady) {
        setTxError('交易对未就绪（未创建或无流动性）')
        return
      }
      if (!fromAmount || Number(fromAmount) <= 0) {
        setTxError('请输入出售数量')
        return
      }

      setSubmitting(true)

      // Convert user input amount to wei units required by the contract 将用户输入的金额转换为合约所需的 wei 单位
      // fromAmount is the user input amount 用户输入的第一个数字，fromToken.decimals是代币的精度18
      const amtIn = parseUnits(fromAmount, fromToken.decimals) // 比如用户输入11 则 amtIn = 11000000000000000000n
      // path = [fromToken.address, toToken.address] // path[0] = 用户换出的代币的地址,比如PW; path[1] = 预期换到的代币的地址,比如 FLF
      const path: Address[] = [fromToken.address as Address, toToken.address as Address]
      
      // amounts = [ input amount, output amount ] // amounts[0] = 用户换出的代币的数量,比如PW; amounts[1] = 预期换到的代币的数量,比如 FLF
      const amounts = await publicClient.readContract({
        address: ROUTER_ADDRESS as Address,
        abi: routerAbi,
        functionName: 'getAmountsOut',
        args: [amtIn, path],
      }) as bigint[]
      // quotedOut is the expected output amount 报价输出量
      // quotedOut is at the 2nd position of the array amounts, the 1st position is the input amount 报价输出量是数组amounts的第二个位置，第一个位置是输入量
      const quotedOut = amounts[amounts.length - 1]
      
      // =============== 计算滑点开始 ===============
      // Calculate slippage tolerance (BPS = Basis Points) 计算滑点容忍度（BPS = Basis Points，基点）
      // BPS is a common unit in finance: 1 BPS = 0.01%, 100 BPS = 1%, 10000 BPS = 100%
      // BPS 是金融中常用的计量单位：1 BPS = 0.01%，100 BPS = 1%，10000 BPS = 100%
      // Example: 0.5% slippage = 50 BPS, 1% slippage = 100 BPS 例如：滑点 0.5% = 50 BPS，滑点 1% = 100 BPS
      // ! .max just to avoid negative slippage  使用.max 只是为了避免负滑点
      // ! multiple 100 to get the percentage 乘以100得到百分比
      const bps = Math.max(0, Math.floor(Number(slippage || '0.5') * 100))
      // Calculate minimum output amount considering slippage
      // 计算考虑滑点后的最小输出量
      // Formula: minOutput = quotedAmount × (1 - slippagePercentage)
      // 公式：最小输出量 = 报价量 × (1 - 滑点百分比)
      // Example: quote 95 tokens, 0.5% slippage (50 BPS)
      // 例如：报价 95 个代币，滑点 0.5%（50 BPS）
      // minOut = (95 * (10000 - 50)) / 10000 = (95 * 9950) / 10000 = 94.45
      // This means user will receive at least 94.45 tokens even if price fluctuates slightly
      // 这意味着用户至少能获得 94.45 个代币，即使价格有轻微波动
      // ! 10000 - bps to get the percentage is 94.45%; 10000 - bps 得到百分比, 即94.45%
      // ! divide 10000 to get the percentage 除以10000得到百分比
      // * 该式用数学符号写出为: 95 * ((10000 - 50) / 10000) = 94.45 即 95 * 0.995 = 94.45
      const minOut = (quotedOut * BigInt(10000 - bps)) / 10000n
      // =============== 计算滑点结束 ===============

      // Check if user has sufficient balance
      // 检查用户余额是否足够
      const balance = await publicClient.readContract({
        address: fromToken.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      }) as bigint
      if (balance < amtIn) {
        setTxError(`余额不足: 需要 ${fromAmount} ${fromToken.symbol}`)
        return
      }

      // Check and approve Router contract to spend user's tokens
      // 检查并授权 Router 合约使用用户的代币 
      // ! allowance 中文是授权额度的意思, 以 MetaMask 钱包为例可以在钱包里设置该额度
      // ! 交换时不超额度可不用授权, 如不设置, 每次交换均得在钱包里点击授权
      const allowance = await publicClient.readContract({
        address: fromToken.address as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as Address, ROUTER_ADDRESS as Address],
      }) as bigint
      if (allowance < amtIn) {
        // If allowance is insufficient, approve first
        // 如果授权额度不足，先进行授权
        // ! approveHash 授权交易的哈希, 
        const approveHash = await writeContractAsync({
          abi: erc20Abi,
          address: fromToken.address as Address,
          functionName: 'approve',
          args: [ROUTER_ADDRESS as Address, amtIn],
        })
        await publicClient.waitForTransactionReceipt({ hash: approveHash })
      }

      // Set transaction deadline (20 minutes from now)
      // 设置交易截止时间（20分钟后）
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)
      
      // Execute token swap
      // 执行代币交换
      // swapExactTokensForTokens parameters:
      // swapExactTokensForTokens 参数说明：
      // - amtIn: input token amount 输入代币数量
      // - minOut: minimum output token amount (considering slippage) 最小输出代币数量（考虑滑点）
      // - path: swap path [tokenA address, tokenB address] 交换路径 [代币A地址, 代币B地址]
      // - address: recipient address (user address) 接收地址（用户地址）
      // - deadline: transaction deadline 交易截止时间
      const txHash = await writeContractAsync({
        abi: routerAbi,
        address: ROUTER_ADDRESS as Address,
        functionName: 'swapExactTokensForTokens',
        args: [amtIn, minOut, path, address as Address, deadline],
      })
      await publicClient.waitForTransactionReceipt({ hash: txHash })
      setTxSuccess(`交换成功！交易哈希: ${txHash}`)
      setFromAmount('')
      setToAmount('')
    } catch (e) {
      let msg = '未知错误'
      if (e instanceof Error) {
        msg = e.message
        if (msg.toLowerCase().includes('circuit breaker is open')) msg = '节点暂时不可用，请稍后重试'
        else if (msg.includes('user rejected')) msg = '用户取消了交易'
      }
      setTxError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    // State
    fromToken,
    toToken,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    loadingQuote,
    quoteError,
    pairReady,
    activeField,
    setActiveField,
    mounted,
    submitting,
    txError,
    txSuccess,
    slippage,
    setSlippage,
    currentBalance,
    
    // Actions
    handleMax,
    handleSwap,
    setFromToken,
    setToToken,
  }
}
