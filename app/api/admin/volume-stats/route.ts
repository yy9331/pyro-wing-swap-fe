import { NextResponse } from 'next/server'
import { getCacheStats } from '@/lib/services/volume-cache'
import { getAllPoolsVolume24h } from '@/lib/services/graphql-service'

export async function GET() {
  try {
    // Get cache statistics
    // 获取缓存统计信息
    const cacheStats = await getCacheStats()
    
    // Get all pools volume data
    // 获取所有池子的交易量数据
    const poolsData = await getAllPoolsVolume24h()
    
    // Calculate total volume across all pools
    // 计算所有池子的总交易量
    const totalVolume24h_a = poolsData.reduce((sum, pool) => 
      sum + parseFloat(pool.volume_24h_a || '0'), 0
    )
    const totalVolume24h_b = poolsData.reduce((sum, pool) => 
      sum + parseFloat(pool.volume_24h_b || '0'), 0
    )
    
    // Get recent activity (pools updated in last hour)
    // 获取最近活动（过去一小时更新的池子）
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentPools = poolsData.filter(pool => 
      new Date(pool.last_updated) > oneHourAgo
    )
    
    return NextResponse.json({
      cache: {
        totalCachedPools: cacheStats.totalCachedPools,
        cacheHitRate: cacheStats.cacheHitRate,
        oldestCache: cacheStats.oldestCache ? new Date(cacheStats.oldestCache).toISOString() : null,
        newestCache: cacheStats.newestCache ? new Date(cacheStats.newestCache).toISOString() : null
      },
      pools: {
        total: poolsData.length,
        recent: recentPools.length,
        totalVolume24h_a,
        totalVolume24h_b
      },
      poolsData: poolsData.map(pool => ({
        id: pool.id,
        pair: `${pool.token_a_symbol}-${pool.token_b_symbol}`,
        volume24h_a: parseFloat(pool.volume_24h_a || '0'),
        volume24h_b: parseFloat(pool.volume_24h_b || '0'),
        lastUpdated: pool.last_updated
      })),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error getting volume stats:', error)
    return NextResponse.json(
      { error: 'Failed to get volume stats' },
      { status: 500 }
    )
  }
}
