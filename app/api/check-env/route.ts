import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      // Supabase配置
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      
      // Redis配置
      redisUrl: !!process.env.KV_REST_API_URL,
      redisToken: !!process.env.KV_REST_API_TOKEN,
      
      // 区块链配置
      sepoliaRpcUrl: !!process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
      
      // 其他配置
      cronSecret: !!process.env.CRON_SECRET,
      
      // 合约地址
      factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x7a8d0232d306fbd0aa24a67c8aa9a6db88ebc522',
      routerAddress: process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '0xe6d9806164180eb95489800c4b6ff5972f10c533'
    }
    
    const missingVars = Object.entries(envCheck)
      .filter(([, value]) => !value)
      .map(([key]) => key)
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      missingVariables: missingVars,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error checking environment:', error)
    return NextResponse.json(
      { error: 'Failed to check environment' },
      { status: 500 }
    )
  }
}

