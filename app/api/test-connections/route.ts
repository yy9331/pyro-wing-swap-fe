import { NextResponse } from 'next/server'
import { testConnections } from '@/lib/test-connection'

export async function GET() {
  try {
    console.log('🚀 Starting connection tests...')
    await testConnections()
    return NextResponse.json({ 
      success: true, 
      message: 'Connections tested - check server logs for details' 
    })
  } catch (error) {
    console.error('💥 Connection test failed:', error)
    return NextResponse.json({ error: 'Connection test failed' }, { status: 500 })
  }
}