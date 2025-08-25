import { getCachedVolumeData } from './volume-cache'

export interface PoolVolumeData {
  id: string
  token_a: string
  token_b: string
  token_a_symbol: string
  token_b_symbol: string
  volume_24h_a: string
  volume_24h_b: string
  last_updated: string
}

export interface TradeData {
  id: string
  amount_a: string
  amount_b: string
  user_address: string
  tx_hash: string
  timestamp: string
}

export interface PoolStats {
  pool: PoolVolumeData
  tradeCount: number
}

/**
 * Get 24h volume data for a specific pool
 * 获取特定池子的24小时交易量数据
 */
export async function getPoolVolume24h(poolId: string): Promise<PoolVolumeData | null> {
  try {
    // First try to get from Redis cache
    const cachedData = await getCachedVolumeData(poolId)
    if (cachedData && isCacheFresh(cachedData.timestamp)) {
      // Return cached data if fresh
      return {
        id: poolId,
        token_a: '', // Would need to be stored in cache or retrieved from DB
        token_b: '',
        token_a_symbol: '',
        token_b_symbol: '',
        volume_24h_a: cachedData.volume24h_a.toString(),
        volume_24h_b: cachedData.volume24h_b.toString(),
        last_updated: new Date(cachedData.timestamp).toISOString()
      }
    }

    // If cache miss or stale, query from Supabase directly
    // 如果缓存未命中或过期，直接从Supabase查询
    const { supabaseAdmin } = await import('@/lib/supabase')
    const { data: pool, error } = await supabaseAdmin
      .from('pools')
      .select('*')
      .eq('id', poolId)
      .single()
    
    if (error || !pool) {
      console.error('Error getting pool from database:', error)
      return null
    }
    
    return {
      id: pool.id,
      token_a: pool.token_a,
      token_b: pool.token_b,
      token_a_symbol: pool.token_a_symbol,
      token_b_symbol: pool.token_b_symbol,
      volume_24h_a: pool.volume_24h_a,
      volume_24h_b: pool.volume_24h_b,
      last_updated: pool.last_updated
    }
    
    return null
  } catch (error) {
    console.error('Error getting pool volume 24h:', error)
    return null
  }
}

/**
 * Get 24h volume data for all pools
 * 获取所有池子的24小时交易量数据
 */
export async function getAllPoolsVolume24h(): Promise<PoolVolumeData[]> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const { data: pools, error } = await supabaseAdmin
      .from('pools')
      .select('*')
    
    if (error) {
      console.error('Error getting pools from database:', error)
      return []
    }
    
    return pools || []
  } catch (error) {
    console.error('Error getting all pools volume 24h:', error)
    return []
  }
}

/**
 * Get trades within a time range for a specific pool
 * 获取特定池子在时间范围内的交易记录
 */
export async function getTradesByTimeRange(
  poolId: string, 
  startTime: string, 
  endTime: string
): Promise<TradeData[]> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const { data: trades, error } = await supabaseAdmin
      .from('trades')
      .select('*')
      .eq('pool_id', poolId)
      .gte('timestamp', startTime)
      .lte('timestamp', endTime)
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('Error getting trades from database:', error)
      return []
    }
    
    return trades || []
  } catch (error) {
    console.error('Error getting trades by time range:', error)
    return []
  }
}

/**
 * Get user trade history
 * 获取用户交易历史
 */
export async function getUserTrades(userAddress: string): Promise<unknown[]> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const { data: userTrades, error } = await supabaseAdmin
      .from('user_trades')
      .select(`
        id,
        pool_id,
        trade_type,
        amount_a,
        amount_b,
        timestamp,
        trades (
          tx_hash
        )
      `)
      .eq('user_address', userAddress)
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('Error getting user trades from database:', error)
      return []
    }
    
    return userTrades || []
  } catch (error) {
    console.error('Error getting user trades:', error)
    return []
  }
}

/**
 * Get pool statistics including volume and trade count
 * 获取池子统计信息，包括交易量和交易数量
 */
export async function getPoolStats(poolId: string): Promise<PoolStats | null> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    
    // Get pool data
    const { data: pool, error: poolError } = await supabaseAdmin
      .from('pools')
      .select('*')
      .eq('id', poolId)
      .single()
    
    if (poolError || !pool) {
      console.error('Error getting pool from database:', poolError)
      return null
    }
    
    // Get trade count
    const { count, error: countError } = await supabaseAdmin
      .from('trades')
      .select('*', { count: 'exact', head: true })
      .eq('pool_id', poolId)
    
    if (countError) {
      console.error('Error getting trade count:', countError)
    }
    
    return {
      pool: {
        id: pool.id,
        token_a: pool.token_a,
        token_b: pool.token_b,
        token_a_symbol: pool.token_a_symbol,
        token_b_symbol: pool.token_b_symbol,
        volume_24h_a: pool.volume_24h_a,
        volume_24h_b: pool.volume_24h_b,
        last_updated: pool.last_updated
      },
      tradeCount: count || 0
    }
  } catch (error) {
    console.error('Error getting pool stats:', error)
    return null
  }
}

/**
 * Calculate 24h volume from raw trades data
 * 从原始交易数据计算24小时交易量
 */
export function calculateVolumeFromTrades(trades: TradeData[]): {
  volume24h_a: number
  volume24h_b: number
} {
  const volume24h_a = trades.reduce((sum, trade) => sum + Number(trade.amount_a), 0)
  const volume24h_b = trades.reduce((sum, trade) => sum + Number(trade.amount_b), 0)
  
  return { volume24h_a, volume24h_b }
}

/**
 * Check if cache is fresh (less than 1 hour old)
 * 检查缓存是否新鲜（少于1小时）
 */
function isCacheFresh(timestamp: number): boolean {
  const oneHourAgo = Date.now() - (60 * 60 * 1000)
  return timestamp > oneHourAgo
}
