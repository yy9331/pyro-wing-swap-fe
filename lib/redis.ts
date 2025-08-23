import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// 只读客户端（用于某些场景）
export const redisReadOnly = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_READ_ONLY_TOKEN!,
})