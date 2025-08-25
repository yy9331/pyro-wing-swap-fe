import { NextRequest, NextResponse } from 'next/server'
import { getPoolVolume24h } from '@/lib/services/graphql-service'
import { getCachedVolumeData } from '@/lib/services/volume-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const poolId = searchParams.get('poolId')
    
    if (!poolId) {
      return NextResponse.json(
        { error: 'Pool ID is required' },
        { status: 400 }
      )
    }

    console.log('Testing pool volume for:', poolId)
    
    // Test Redis cache
    const cachedData = await getCachedVolumeData(poolId)
    console.log('Redis cache data:', cachedData)
    
    // Test database query
    const poolData = await getPoolVolume24h(poolId)
    console.log('Database pool data:', poolData)
    
    return NextResponse.json({
      poolId,
      cachedData,
      poolData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in test API:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
