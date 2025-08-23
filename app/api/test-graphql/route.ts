import { NextRequest, NextResponse } from 'next/server'
import { supabaseGraphQL } from '@/lib/graphql-client'

export async function GET(request: NextRequest) {
  try {
    console.log('测试 Supabase GraphQL 连接...')
    
    // 测试简单的 GraphQL 查询
    const testQuery = `
      query TestConnection {
        __schema {
          types {
            name
            kind
          }
        }
      }
    `
    
    const result: any = await supabaseGraphQL.request(testQuery)
    
    console.log('✅ GraphQL 连接成功！')
    console.log('可用的类型数量:', result.__schema.types.length)
    
    // 查找我们创建的表类型
    const tableTypes = result.__schema.types.filter((type: any) => 
      ['trades', 'pools', 'user_trades'].includes(type.name)
    )
    
    console.log('找到的表类型:', tableTypes.map((t: any) => t.name))
    
    return NextResponse.json({
      success: true,
      message: 'GraphQL 连接成功',
      availableTypes: result.__schema.types.length,
      tableTypes: tableTypes.map((t: any) => t.name),
      sampleTypes: result.__schema.types.slice(0, 10).map((t: any) => ({
        name: t.name,
        kind: t.kind
      }))
    })
    
  } catch (error) {
    console.error('❌ GraphQL 连接失败:', error)
    
    // 检查是否是 GraphQL 扩展未启用的错误
    if (error instanceof Error && error.message.includes('Unknown field')) {
      return NextResponse.json({
        success: false,
        error: 'GraphQL 扩展可能未启用',
        message: '请在 Supabase Dashboard 中启用 pg_graphql 扩展',
        details: error.message
      })
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误',
        message: 'GraphQL 连接失败'
      }, 
      { status: 500 }
    )
  }
}
