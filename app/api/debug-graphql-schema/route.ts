import { NextResponse } from 'next/server'
import { supabaseGraphQL } from '@/lib/graphql-client'

export async function GET() {
  try {
    // Get the GraphQL schema
    const schemaQuery = `
      query IntrospectionQuery {
        __schema {
          queryType {
            name
            fields {
              name
              type {
                name
                kind
              }
            }
          }
          types {
            name
            kind
            fields {
              name
              type {
                name
                kind
              }
            }
          }
        }
      }
    `

    const response = await supabaseGraphQL.request(schemaQuery)
    
    return NextResponse.json({
      success: true,
      schema: response
    })
    
  } catch (error) {
    console.error('Error getting GraphQL schema:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

