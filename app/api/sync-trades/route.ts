import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { redis } from '@/lib/redis'
import { createPublicClient, http, parseAbi } from 'viem'
import { sepolia } from 'viem/chains'
import { FACTORY_ADDRESS, TEST_TOKENS } from '@/lib/constants'
import * as dotenv from 'dotenv'
dotenv.config()

// Create viem client for Sepolia
const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_APP_URL! || process.env.INFURA_RPC_URL!)
})

// Factory ABI for getting pairs
const FACTORY_ABI = parseAbi([
  'function allPairs(uint256) external view returns (address pair)',
  'function allPairsLength() external view returns (uint256)',
  'function getPair(address, address) external view returns (address pair)'
])

// Pair ABI for getting reserves and events (commented out as not currently used)
// const PAIR_ABI = parseAbi([
//   'function token0() external view returns (address)',
//   'function token1() external view returns (address)',
//   'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
//   'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
// ])

// Get all test token pairs
function getTestTokenPairs() {
  const pairs = []
  const tokens = Object.values(TEST_TOKENS)
  console.log('tokens', tokens)
  
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      pairs.push([tokens[i], tokens[j]])
    }
  }
  
  return pairs
}

// Get pair address from factory
async function getPairAddress(tokenA: string, tokenB: string) {
  try {
    const pairAddress = await client.readContract({
      address: FACTORY_ADDRESS as `0x${string}`,
      abi: FACTORY_ABI,
      functionName: 'getPair',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`]
    })
    return pairAddress
  } catch (error) {
    console.error(`Error getting pair address for ${tokenA}-${tokenB}:`, error)
    return null
  }
}

// Get swap events from a pair
async function getSwapEvents(pairAddress: string, fromBlock: bigint, toBlock: bigint) {
  try {
    const logs = await client.getLogs({
      address: pairAddress as `0x${string}`,
      event: {
        type: 'event',
        name: 'Swap',
        inputs: [
          { type: 'address', name: 'sender', indexed: true },
          { type: 'uint256', name: 'amount0In' },
          { type: 'uint256', name: 'amount1In' },
          { type: 'uint256', name: 'amount0Out' },
          { type: 'uint256', name: 'amount1Out' },
          { type: 'address', name: 'to', indexed: true }
        ]
      },
      fromBlock,
      toBlock
    })

    return logs.map(log => ({
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      sender: log.args.sender,
      to: log.args.to,
      amount0In: log.args.amount0In,
      amount1In: log.args.amount1In,
      amount0Out: log.args.amount0Out,
      amount1Out: log.args.amount1Out
    }))
  } catch (error) {
    console.error(`Error getting swap events for ${pairAddress}:`, error)
    return []
  }
}

// Calculate 24h volume for a pool
async function calculate24hVolume(poolId: string) {
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

  const { data: trades, error } = await supabaseAdmin
    .from('trades')
    .select('amount_a, amount_b')
    .eq('pool_id', poolId)
    .gte('timestamp', twentyFourHoursAgo.toISOString())

  if (error) {
    console.error('Error calculating 24h volume:', error)
    return { volume24h_a: 0, volume24h_b: 0 }
  }

  const volume24h_a = trades.reduce((sum, trade) => sum + Number(trade.amount_a), 0)
  const volume24h_b = trades.reduce((sum, trade) => sum + Number(trade.amount_b), 0)

  return { volume24h_a, volume24h_b }
}

// Update pool data in database
async function updatePoolData(poolId: string, tokenA: string, tokenB: string, volume24h_a: number, volume24h_b: number) {
  const { error } = await supabaseAdmin
    .from('pools')
    .upsert({
      id: poolId,
      token_a: tokenA,
      token_b: tokenB,
      token_a_symbol: Object.values(TEST_TOKENS).find(t => t.address.toLowerCase() === tokenA.toLowerCase())?.symbol || 'UNKNOWN',
      token_b_symbol: Object.values(TEST_TOKENS).find(t => t.address.toLowerCase() === tokenB.toLowerCase())?.symbol || 'UNKNOWN',
      fee_tier: 3000, // 0.3%
      volume_24h_a: volume24h_a.toString(),
      volume_24h_b: volume24h_b.toString(),
      last_updated: new Date().toISOString()
    })

  if (error) {
    console.error('Error updating pool data:', error)
  }
}

// Cache pool data in Redis
async function cachePoolData(poolId: string, volume24h_a: number, volume24h_b: number) {
  const cacheKey = `pool:${poolId}:volume24h`
  const cacheData = {
    volume24h_a,
    volume24h_b,
    timestamp: Date.now()
  }

  try {
    await redis.set(cacheKey, JSON.stringify(cacheData), { ex: 3600 }) // 1 hour expiry
    console.log(`Cached data for pool ${poolId}:`, JSON.stringify(cacheData))
  } catch (error) {
    console.error(`Error caching data for pool ${poolId}:`, error)
  }
}

export async function POST() {
  try {
    console.log('Starting trade data sync...')
    
    const testTokenPairs = getTestTokenPairs()
    const currentBlock = await client.getBlockNumber()
    const fromBlock = currentBlock - BigInt(1000) // Get last 1000 blocks for recent trades
    
    for (const [tokenA, tokenB] of testTokenPairs) {
      const pairAddress = await getPairAddress(tokenA.address, tokenB.address)
      
      if (!pairAddress || pairAddress === '0x0000000000000000000000000000000000000000') {
        console.log(`No pair found for ${tokenA.symbol}-${tokenB.symbol}`)
        continue
      }

      console.log(`Processing pair ${tokenA.symbol}-${tokenB.symbol} at ${pairAddress}`)
      
      // Get swap events
      const swapEvents = await getSwapEvents(pairAddress, fromBlock, currentBlock)
      
              // Insert trades into database
        for (const event of swapEvents) {
          // Skip events with undefined amounts
          if (event.amount0In === undefined || event.amount1In === undefined) {
            continue
          }
          
          const { error } = await supabaseAdmin.rpc('insert_trade_safe', {
            p_pool_id: pairAddress,
            p_token_a: tokenA.address,
            p_token_b: tokenB.address,
            p_amount_a: event.amount0In.toString(),
            p_amount_b: event.amount1In.toString(),
            p_user_address: event.sender,
            p_tx_hash: event.txHash,
            p_block_number: Number(event.blockNumber)
          })

          if (error) {
            console.error('Error inserting trade:', error)
          }
        }

      // Calculate and update 24h volume
      const { volume24h_a, volume24h_b } = await calculate24hVolume(pairAddress)
      await updatePoolData(pairAddress, tokenA.address, tokenB.address, volume24h_a, volume24h_b)
      await cachePoolData(pairAddress, volume24h_a, volume24h_b)
    }

    console.log('Trade data sync completed')
    return NextResponse.json({ success: true, message: 'Trade data synced successfully' })
    
  } catch (error) {
    console.error('Error in trade sync:', error)
    return NextResponse.json({ success: false, error: 'Failed to sync trade data' }, { status: 500 })
  }
}
