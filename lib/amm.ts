import { Address, parseUnits, formatUnits } from 'viem'
import { publicClient, routerAbi, factoryAbi, pairAbi } from '@/lib/contract'
import { ROUTER_ADDRESS, TEST_TOKENS, FACTORY_ADDRESS } from '@/lib/constants'

type LiquidityCheck = { ok: boolean; reason?: 'NO_POOL' | 'NO_LIQUIDITY' }

export type PairInfo = {
  ok: boolean
  reason?: 'NO_POOL' | 'NO_LIQUIDITY'
  pair?: Address
  token0?: Address
  token1?: Address
  reserve0?: bigint
  reserve1?: bigint
}

export async function getPairInfo(tokenA: Address, tokenB: Address): Promise<PairInfo> {
  const zeroAddr = '0x0000000000000000000000000000000000000000'
  const pair = await publicClient.readContract({
    address: FACTORY_ADDRESS as Address,
    abi: factoryAbi,
    functionName: 'getPair',
    args: [tokenA, tokenB],
  }) as Address

  if (!pair || pair.toLowerCase() === zeroAddr) return { ok: false, reason: 'NO_POOL' }

  const [token0, token1] = await Promise.all([
    publicClient.readContract({ address: pair as Address, abi: pairAbi, functionName: 'token0' }) as Promise<Address>,
    publicClient.readContract({ address: pair as Address, abi: pairAbi, functionName: 'token1' }) as Promise<Address>,
  ])
  const [r0, r1] = await publicClient.readContract({
    address: pair as Address,
    abi: pairAbi,
    functionName: 'getReserves',
  }) as [bigint, bigint, number]

  if (r0 === 0n || r1 === 0n) return { ok: false, reason: 'NO_LIQUIDITY', pair, token0, token1, reserve0: r0, reserve1: r1 }
  return { ok: true, pair, token0, token1, reserve0: r0, reserve1: r1 }
}

async function hasLiquidity(tokenA: Address, tokenB: Address): Promise<LiquidityCheck> {
  const info = await getPairInfo(tokenA, tokenB)
  return { ok: info.ok, reason: info.reason }
}

export async function quoteOut(params: {
  amountIn: string
  fromSymbol: keyof typeof TEST_TOKENS
  toSymbol: keyof typeof TEST_TOKENS
}): Promise<{ amountOut: string; reason?: string }> {
  const { amountIn, fromSymbol, toSymbol } = params
  const from = TEST_TOKENS[fromSymbol]
  const to = TEST_TOKENS[toSymbol]

  if (!amountIn || Number(amountIn) <= 0) return { amountOut: '0', reason: 'ZERO_IN' }
  if (from.address === to.address) return { amountOut: '0', reason: 'SAME_TOKEN' }

  const chk = await hasLiquidity(from.address as Address, to.address as Address)
  if (!chk.ok) return { amountOut: '0', reason: chk.reason }

  try {
    const amtIn = parseUnits(amountIn, from.decimals)
    const path: Address[] = [from.address as Address, to.address as Address]
    const amounts = await publicClient.readContract({
      address: ROUTER_ADDRESS as Address,
      abi: routerAbi,
      functionName: 'getAmountsOut',
      args: [amtIn, path],
    }) as bigint[]
    const out = amounts[amounts.length - 1]
    return { amountOut: formatUnits(out, to.decimals) }
  } catch {
    return { amountOut: '0', reason: 'ROUTER_REVERT' }
  }
}

export async function quoteIn(params: {
  amountOut: string
  fromSymbol: keyof typeof TEST_TOKENS
  toSymbol: keyof typeof TEST_TOKENS
}): Promise<{ amountIn: string; reason?: string }> {
  const { amountOut, fromSymbol, toSymbol } = params
  const from = TEST_TOKENS[fromSymbol]
  const to = TEST_TOKENS[toSymbol]

  if (!amountOut || Number(amountOut) <= 0) return { amountIn: '0', reason: 'ZERO_OUT' }
  if (from.address === to.address) return { amountIn: '0', reason: 'SAME_TOKEN' }

  const chk = await hasLiquidity(from.address as Address, to.address as Address)
  if (!chk.ok) return { amountIn: '0', reason: chk.reason }

  try {
    const amtOut = parseUnits(amountOut, to.decimals)
    const path: Address[] = [from.address as Address, to.address as Address]
    const amounts = await publicClient.readContract({
      address: ROUTER_ADDRESS as Address,
      abi: routerAbi,
      functionName: 'getAmountsIn',
      args: [amtOut, path],
    }) as bigint[]
    const needIn = amounts[0]
    return { amountIn: formatUnits(needIn, from.decimals) }
  } catch {
    return { amountIn: '0', reason: 'ROUTER_REVERT' }
  }
}