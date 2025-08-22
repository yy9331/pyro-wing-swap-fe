'use client'

import { Layout } from '@/components/Layout'
import { LiquidityPools } from '@/components/LiquidityPools'

const PoolsPage = () => {
  return (
    <Layout>
      <div className="hover-card">
        <LiquidityPools />
      </div>
    </Layout>
  )
}

export default PoolsPage
