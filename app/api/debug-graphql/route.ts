import { NextRequest, NextResponse } from 'next/server'
import { supabaseGraphQL } from '../../../lib/graphql-client'

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json()
    
    if (!query) {
      return NextResponse.json(
        { error: '请提供 GraphQL 查询语句' },
        { status: 400 }
      )
    }
    
    console.log('🔍 执行 GraphQL 查询:', query)
    if (variables) {
      console.log('📊 查询变量:', variables)
    }
    
    const result = await supabaseGraphQL.request(query, variables)
    
    console.log('✅ 查询成功')
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ GraphQL 查询失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

// 也支持 GET 请求来测试简单的查询
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({
        message: 'GraphQL 调试工具',
        usage: {
          GET: '?query=YOUR_GRAPHQL_QUERY',
          POST: '{ "query": "YOUR_GRAPHQL_QUERY", "variables": {} }'
        },
        examples: [
          '查询所有交易: ?query=query{ tradesCollection { edges { node { id pool_id amount_a } } } }',
          '查询 Schema: ?query=query{ __schema { types { name kind } } }'
        ]
      })
    }
    
    console.log('🔍 执行 GraphQL 查询:', query)
    const result = await supabaseGraphQL.request(query)
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ GraphQL 查询失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误' 
      }, 
      { status: 500 }
    )
  }
}
