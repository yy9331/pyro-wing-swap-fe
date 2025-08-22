'use client'

import { Layout } from '@/components/Layout'
import { AddLiquidity } from '@/components/AddLiquidity'

const LiquidityPage = () => {
  return (
    <Layout>
      <div className="hover-card">
        <AddLiquidity />
      </div>
    </Layout>
  )
}

export default LiquidityPage
