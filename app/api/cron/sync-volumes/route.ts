import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cacheVolumeData } from '@/lib/services/volume-cache'

// Verify cron secret to ensure this is called by the scheduler
// 验证cron密钥以确保这是由调度器调用的
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.CRON_SECRET
  
  if (!expectedSecret) {
    console.warn('CRON_SECRET not configured')
    return true // Allow if no secret configured
  }
  
  return authHeader === `Bearer ${expectedSecret}`
}

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    // 验证这是合法的cron请求
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting hourly volume sync...')
    
    // Get all pools from database
    // 从数据库获取所有池子
    const { data: pools, error: poolsError } = await supabaseAdmin
      .from('pools')
      .select('id, token_a, token_b, volume_24h_a, volume_24h_b')
    
    if (poolsError) {
      console.error('Error fetching pools:', poolsError)
      return NextResponse.json(
        { error: 'Failed to fetch pools' },
        { status: 500 }
      )
    }

    // Update cache for each pool
    // 为每个池子更新缓存
    const cachePromises = pools.map(pool => 
      cacheVolumeData(
        pool.id,
        parseFloat(pool.volume_24h_a || '0'),
        parseFloat(pool.volume_24h_b || '0')
      )
    )

    await Promise.all(cachePromises)
    
    console.log(`Updated cache for ${pools.length} pools`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${pools.length} pools`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in volume sync cron:', error)
    return NextResponse.json(
      { error: 'Failed to sync volumes' },
      { status: 500 }
    )
  }
}

// Also support GET for manual triggering
// 也支持GET用于手动触发
export async function GET(request: NextRequest) {
  return POST(request)
}

