import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    console.log('Clearing all volume cache data...')
    
    // Get all volume cache keys
    const keys = await redis.keys('pool:*:volume24h')
    console.log('Found cache keys:', keys)
    
    if (keys.length > 0) {
      // Delete all volume cache keys
      await redis.del(...keys)
      console.log(`Cleared ${keys.length} cache entries`)
    }
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${keys.length} cache entries`,
      clearedKeys: keys
    })
    
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all volume cache keys
    const keys = await redis.keys('pool:*:volume24h')
    const cacheData = []
    
    for (const key of keys) {
      try {
        const data = await redis.get(key)
        cacheData.push({
          key,
          data: data,
          isValid: data ? (() => {
            try {
              JSON.parse(data as string)
              return true
            } catch {
              return false
            }
          })() : false
        })
      } catch (error) {
        cacheData.push({
          key,
          data: null,
          isValid: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      cacheKeys: keys,
      cacheData: cacheData
    })
    
  } catch (error) {
    console.error('Error getting cache info:', error)
    return NextResponse.json(
      { error: 'Failed to get cache info' },
      { status: 500 }
    )
  }
}
