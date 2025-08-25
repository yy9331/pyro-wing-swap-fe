import { NextRequest, NextResponse } from 'next/server'
import { getCachedVolumeData } from '@/lib/services/volume-cache'
import { getPoolVolume24h } from '@/lib/services/graphql-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const { poolId } = await params
    
    if (!poolId) {
      return NextResponse.json(
        { error: 'Pool ID is required' },
        { status: 400 }
      )
    }

    // First try to get from Redis cache
    // 首先尝试从Redis缓存获取
    const cachedData = await getCachedVolumeData(poolId)
    
    if (cachedData) {
      return NextResponse.json({
        poolId,
        volume24h_a: cachedData.volume24h_a,
        volume24h_b: cachedData.volume24h_b,
        timestamp: cachedData.timestamp,
        source: 'cache'
      })
    }

    // If cache miss, try to get from GraphQL/database
    // 如果缓存未命中，尝试从GraphQL/数据库获取
    const poolData = await getPoolVolume24h(poolId)
    
    if (poolData) {
      return NextResponse.json({
        poolId,
        volume24h_a: parseFloat(poolData.volume_24h_a),
        volume24h_b: parseFloat(poolData.volume_24h_b),
        timestamp: new Date(poolData.last_updated).getTime(),
        source: 'database'
      })
    }

    // If no data found, return zero volume
    // 如果没有找到数据，返回零交易量
    return NextResponse.json({
      poolId,
      volume24h_a: 0,
      volume24h_b: 0,
      timestamp: Date.now(),
      source: 'default'
    })

  } catch (error) {
    console.error('Error getting pool volume:', error)
    return NextResponse.json(
      { error: 'Failed to get pool volume' },
      { status: 500 }
    )
  }
}
