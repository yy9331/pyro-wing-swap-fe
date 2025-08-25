import cron from 'node-cron'
import fetch from 'node-fetch'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Sync volumes daily at midnight
// 每天午夜同步交易量
cron.schedule('0 0 * * *', async () => {
  console.log('🕐 Running hourly volume sync...')
  try {
    const response = await fetch(`${API_BASE_URL}/api/cron/sync-volumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
      }
    })
    
    if (response.ok) {
      const result = await response.json() as { message: string }
      console.log('✅ Volume sync completed:', result.message)
    } else {
      console.error('❌ Volume sync failed:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Volume sync error:', error)
  }
})

// Sync trades daily at noon (for development)
// 每天中午同步交易数据（开发环境）
cron.schedule('0 12 * * *', async () => {
  console.log('🔄 Running trade sync...')
  try {
    const response = await fetch(`${API_BASE_URL}/api/sync-trades`, {
      method: 'POST'
    })
    
    if (response.ok) {
      const result = await response.json() as { message: string }
      console.log('✅ Trade sync completed:', result.message)
    } else {
      console.error('❌ Trade sync failed:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Trade sync error:', error)
  }
})

console.log('🚀 Cron jobs started!')
console.log('📅 Volume sync: Daily at midnight (00:00)')
console.log('📅 Trade sync: Daily at noon (12:00)')
console.log('🌐 API Base URL:', API_BASE_URL)

// Keep the process running
process.on('SIGINT', () => {
  console.log('🛑 Stopping cron jobs...')
  process.exit(0)
})
