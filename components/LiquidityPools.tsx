'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePoolData, type PoolData } from '@/hooks/usePoolData'
import { TEST_TOKENS } from '@/lib/constants'
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils'
import { useState, useEffect, Suspense } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

export function LiquidityPools() {
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  // 使用真实的池子数据
  const pwFlfPool: PoolData = usePoolData(TEST_TOKENS.PW.address, TEST_TOKENS.FLF.address) // PW/FLF
  const pwDdlPool: PoolData = usePoolData(TEST_TOKENS.PW.address, TEST_TOKENS.DDL.address) // PW/DDL
  const flfDdlPool: PoolData = usePoolData(TEST_TOKENS.FLF.address, TEST_TOKENS.DDL.address) // FLF/DDL

  const pools = [
    {
      name: 'PW/FLF',
      token0: TEST_TOKENS.PW,
      token1: TEST_TOKENS.FLF,
      data: pwFlfPool,
    },
    {
      name: 'PW/DDL',
      token0: TEST_TOKENS.PW,
      token1: TEST_TOKENS.DDL,
      data: pwDdlPool,
    },
    {
      name: 'FLF/DDL',
      token0: TEST_TOKENS.FLF,
      token1: TEST_TOKENS.DDL,
      data: flfDdlPool,
    },
  ]

  // 服务端渲染时显示加载状态
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t('liquidity.title')}</h2>
          <div className="text-sm text-gray-400">
            {t('liquidity.real_time')}
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400">{t('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white gradient-text">{t('liquidity.title')}</h2>
        <div className="text-base text-gray-600 dark:text-gray-400">
          {t('liquidity.real_time')}
        </div>
      </div>

      {/* Use React Suspense to show fallback while any pool data is loading 使用 React Suspense 在任意池子数据加载时显示回退 */}
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0,1,2].map(i => (
            <Card key={i} className="bg-white/80 dark:bg-gray-800 border-orange-200 dark:border-gray-700 shadow-lg animated-card backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white"><span className="loading-dots">{t('loading')}</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-orange-50 dark:bg-gray-700/50 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <Card key={pool.name} className="bg-white/80 dark:bg-gray-800 border-orange-200 dark:border-gray-700 shadow-lg animated-card backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{pool.token0.symbol}</span>
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <span className="text-lg">{pool.token1.symbol}</span>
                  </div>
                  {pool.data.exists && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      {t('liquidity.active')}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Loading state: Show loading indicator while data is being fetched 加载状态：在数据获取时显示加载指示器 */}
                {pool.data.isLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm mb-2">{t('loading')}</div>
                    <div className="text-xs text-gray-500">
                      {t('fetchingDataFromBlockchain')}
                    </div>
                  </div>
                ) : pool.data.exists ? (
                  <>
                    {/* Pool exists: Display all pool data 池子存在：显示所有池子数据 */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">TVL</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(pool.data.tvl)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">APR</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {formatPercentage(pool.data.apr)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('volume24h')}</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(pool.data.volume24h)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('lpTokens')}</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatNumber(pool.data.lpTokens)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-orange-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('reserves')}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{pool.token0.symbol}</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatNumber(parseFloat(pool.data.reserve0))}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{pool.token1.symbol}</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatNumber(parseFloat(pool.data.reserve1))}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  // Pool doesn't exist: Show message to create pool 池子不存在：显示创建池子的消息
                  <div className="text-center py-8">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">{t('poolNotCreated')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {t('goToAddLiquidityToCreatePool')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Suspense>

      <div className="mt-6 p-4 bg-orange-50/80 dark:bg-gray-800 rounded-lg border border-orange-200/50 dark:border-gray-700 animated-card backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 gradient-text">{t('poolStatusDescription')}</h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div>• <span className="text-green-600 dark:text-green-400">{t('liquidity.active')}</span> - {t('poolCreatedWithLiquidity')}</div>
          <div>• <span className="text-gray-600 dark:text-gray-400">{t('poolNotCreated')}</span> - {t('needToAddLiquidityFirst')}</div>
          <div>• TVL ({t('totalValueLocked')}) - {t('totalValueOfTokensInPool')}</div>
          <div>• APR ({t('annualPercentageRate')}) - {t('annualizedReturnBasedOnFees')}</div>
          <div>• {t('lpTokens')} - {t('totalAmountOfLPTokens')}</div>
        </div>
      </div>
    </div>
  )
}