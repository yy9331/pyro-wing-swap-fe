import { supabase } from './supabase'
import { redis } from './redis'

export async function testConnections() {
  console.log('🔍 Testing connections...')
  
  try {
    // 测试 Supabase 连接
    console.log('📊 Testing Supabase connection...')
    const { data, error } = await supabase
      .from('notes')
      .select('title')
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
    } else {
      console.log('✅ Supabase connected successfully')
    }

    // 测试 Redis 连接
    console.log('🔴 Testing Redis connection...')
    await redis.set('test', 'connection-test')
    const testValue = await redis.get('test')
    
    if (testValue === 'connection-test') {
      console.log('✅ Redis connected successfully')
      await redis.del('test') // 清理测试数据
    } else {
      console.log('❌ Redis connection failed')
    }

    console.log('🎉 Connection tests completed!')

  } catch (error) {
    console.error('💥 Connection test failed:', error)
  }
}