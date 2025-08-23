import { GraphQLClient } from 'graphql-request'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建 Supabase GraphQL 客户端
export const supabaseGraphQL = new GraphQLClient(
  `${supabaseUrl}/graphql/v1`,
  {
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
  }
)