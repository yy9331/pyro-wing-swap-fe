'use client'

import { formatUnits } from 'viem'
import { useLanguage } from '@/hooks/useLanguage'

export function PoolInfoCard({
  exists,
  reserve0,
  reserve1,
  token0Decimals,
  token1Decimals,
  token0Symbol,
  token1Symbol,
}: {
  exists: boolean
  reserve0: bigint
  reserve1: bigint
  token0Decimals: number
  token1Decimals: number
  token0Symbol: string
  token1Symbol: string
}) {
  const { t } = useLanguage()

  return (
    <div className="space-y-2 p-3 bg-orange-50/50 dark:bg-gray-700/30 rounded-lg border border-orange-200/50 dark:border-gray-600/30">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {exists ? (
          <div>
            <div>{t('poolStatus')}: <span className="text-green-600 dark:text-green-400">{t('exists')}</span></div>
            <div>
              {t('currentRatio')}: 1 {token0Symbol} = {
                reserve0 > 0n && reserve1 > 0n
                  ? (
                      Number(formatUnits(reserve1, token1Decimals)) /
                      Number(formatUnits(reserve0, token0Decimals))
                    ).toFixed(6)
                  : '0'
              } {token1Symbol}
            </div>
          </div>
        ) : (
          <div>
            <div>{t('poolStatus')}: <span className="text-amber-600 dark:text-yellow-400">{t('newPool')}</span></div>
            <div>{t('initialRatio')}: {t('yourSetRatioWillBeInitialPrice')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('tipFreeRatioSetting')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


