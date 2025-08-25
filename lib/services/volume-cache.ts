import { redis } from '@/lib/redis'

// Redis key patterns
const VOLUME_CACHE_KEY = 'pool:{poolId}:volume24h'
// const POOL_LIST_KEY = 'pools:active' // Not currently used

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600

export interface VolumeData {
  volume24h_a: number
  volume24h_b: number
  timestamp: number
}

export interface PoolVolumeData {
  poolId: string
  tokenA: string
  tokenB: string
  volume24h_a: number
  volume24h_b: number
  lastUpdated: number
}

/**
 * Cache volume data for a specific pool
 * 缓存特定池子的交易量数据
 */
export async function cacheVolumeData(
  poolId: string, 
  volume24h_a: number, 
  volume24h_b: number
): Promise<void> {
  const cacheKey = VOLUME_CACHE_KEY.replace('{poolId}', poolId)
  const volumeData: VolumeData = {
    volume24h_a,
    volume24h_b,
    timestamp: Date.now()
  }

  await redis.set(cacheKey, JSON.stringify(volumeData), { ex: CACHE_DURATION })
}

/**
 * Get cached volume data for a specific pool
 * 获取特定池子的缓存交易量数据
 */
export async function getCachedVolumeData(poolId: string): Promise<VolumeData | null> {
  const cacheKey = VOLUME_CACHE_KEY.replace('{poolId}', poolId)
  
  try {
    const cachedData = await redis.get(cacheKey)
    if (!cachedData) return null
    
    return JSON.parse(cachedData as string) as VolumeData
  } catch (error) {
    console.error('Error getting cached volume data:', error)
    return null
  }
}

/**
 * Cache multiple pool volumes at once
 * 批量缓存多个池子的交易量数据
 */
export async function cacheMultiplePoolVolumes(poolVolumes: PoolVolumeData[]): Promise<void> {
  const pipeline = redis.pipeline()
  
  for (const pool of poolVolumes) {
    const cacheKey = VOLUME_CACHE_KEY.replace('{poolId}', pool.poolId)
    const volumeData: VolumeData = {
      volume24h_a: pool.volume24h_a,
      volume24h_b: pool.volume24h_b,
      timestamp: pool.lastUpdated
    }
    
    pipeline.set(cacheKey, JSON.stringify(volumeData), { ex: CACHE_DURATION })
  }
  
  await pipeline.exec()
}

/**
 * Get all cached pool volumes
 * 获取所有缓存的池子交易量数据
 */
export async function getAllCachedVolumes(): Promise<PoolVolumeData[]> {
  try {
    // Get all keys matching the pattern
    const keys = await redis.keys(VOLUME_CACHE_KEY.replace('{poolId}', '*'))
    const volumes: PoolVolumeData[] = []
    
    for (const key of keys) {
      const poolId = key.split(':')[1] // Extract poolId from key
      const cachedData = await redis.get(key)
      
      if (cachedData) {
        const volumeData = JSON.parse(cachedData as string) as VolumeData
        volumes.push({
          poolId,
          tokenA: '', // Would need to be stored separately or retrieved from DB
          tokenB: '', // Would need to be stored separately or retrieved from DB
          volume24h_a: volumeData.volume24h_a,
          volume24h_b: volumeData.volume24h_b,
          lastUpdated: volumeData.timestamp
        })
      }
    }
    
    return volumes
  } catch (error) {
    console.error('Error getting all cached volumes:', error)
    return []
  }
}

/**
 * Clear cache for a specific pool
 * 清除特定池子的缓存
 */
export async function clearPoolCache(poolId: string): Promise<void> {
  const cacheKey = VOLUME_CACHE_KEY.replace('{poolId}', poolId)
  await redis.del(cacheKey)
}

/**
 * Clear all volume caches
 * 清除所有交易量缓存
 */
export async function clearAllVolumeCaches(): Promise<void> {
  const keys = await redis.keys(VOLUME_CACHE_KEY.replace('{poolId}', '*'))
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

/**
 * Check if cache is fresh (less than 1 hour old)
 * 检查缓存是否新鲜（少于1小时）
 */
export function isCacheFresh(timestamp: number): boolean {
  const oneHourAgo = Date.now() - (60 * 60 * 1000)
  return timestamp > oneHourAgo
}

/**
 * Get cache statistics
 * 获取缓存统计信息
 */
export async function getCacheStats(): Promise<{
  totalCachedPools: number
  cacheHitRate: number
  oldestCache: number | null
  newestCache: number | null
}> {
  const keys = await redis.keys(VOLUME_CACHE_KEY.replace('{poolId}', '*'))
  const volumes = await getAllCachedVolumes()
  
  const timestamps = volumes.map(v => v.lastUpdated)
  const oldestCache = timestamps.length > 0 ? Math.min(...timestamps) : null
  const newestCache = timestamps.length > 0 ? Math.max(...timestamps) : null
  
  return {
    totalCachedPools: keys.length,
    cacheHitRate: 0, // Would need to implement hit tracking
    oldestCache,
    newestCache
  }
}
