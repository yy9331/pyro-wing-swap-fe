'use client'

import { useAddLiquidity } from '@/hooks/useAddLiquidity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { formatUnits } from 'viem'
import { TokenInput } from '@/components/add-liquidity/TokenInput'
import { ErrorBanner, SuccessBanner } from '@/components/add-liquidity/ErrorBanner'
import { PoolInfoCard } from '@/components/add-liquidity/PoolInfoCard'
import { TEST_TOKENS } from '@/lib/constants'
import { useLanguage } from '@/hooks/useLanguage'

export function AddLiquidity() {
	const { t } = useLanguage()
	const {
		token0, token1,
		amount0, amount1,
		slippage, setSlippage,
		balance0, balance1,
		poolInfo,
		submitting,
		error, setError,
		success, setSuccess,
		handleAmountChange,
		setMaxAmount,
		handleAddLiquidity,
		isConnected,
		pairAddress,
		lpBalance,
		positionShare,
		underlying0,
		underlying1,
		setToken0,
		setToken1,
		mounted,
	} = useAddLiquidity()

	const handleToken0Select = (tokenSymbol: keyof typeof TEST_TOKENS) => {
		setToken0(TEST_TOKENS[tokenSymbol])
		// 清空输入框
		handleAmountChange('', 'amount0')
	}

	const handleToken1Select = (tokenSymbol: keyof typeof TEST_TOKENS) => {
		setToken1(TEST_TOKENS[tokenSymbol])
		// 清空输入框
		handleAmountChange('', 'amount1')
	}

	return (
		<div className="space-y-6">
			<ErrorBanner message={error ?? ''} onClose={() => setError(null)} />
			<SuccessBanner message={success ?? ''} onClose={() => setSuccess(null)} />

			<Card className="bg-white/80 dark:bg-gray-800/50 border-orange-200 dark:border-gray-700 shadow-lg animated-card backdrop-blur-sm">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-3xl font-bold text-gray-900 dark:text-white gradient-text">{t('addLiquidity')}</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<TokenInput
						label={t('token1')}
						value={amount0}
						onChange={(v) => handleAmountChange(v, 'amount0')}
						onMax={() => setMaxAmount('amount0')}
						symbol={token0.symbol}
						logo={token0.logo}
						balanceText={formatUnits(balance0, token0.decimals)}
						onTokenSelect={handleToken0Select}
						excludeSymbol={token1.symbol}
					/>

					<div className="flex justify-center">
						<div className="w-8 h-8 bg-orange-100 dark:bg-gray-700 rounded-full flex items-center justify-center animated-button">
							<Plus className="h-4 w-4 text-orange-600 dark:text-gray-400" />
						</div>
					</div>

					<TokenInput
						label={t('token2')}
						value={amount1}
						onChange={(v) => handleAmountChange(v, 'amount1')}
						onMax={() => setMaxAmount('amount1')}
						symbol={token1.symbol}
						logo={token1.logo}
						balanceText={formatUnits(balance1, token1.decimals)}
						onTokenSelect={handleToken1Select}
						excludeSymbol={token0.symbol}
					/>

					{poolInfo && (
						<PoolInfoCard
							exists={poolInfo.exists}
							reserve0={poolInfo.reserve0}
							reserve1={poolInfo.reserve1}
							token0Decimals={token0.decimals}
							token1Decimals={token1.decimals}
							token0Symbol={token0.symbol}
							token1Symbol={token1.symbol}
						/>
					)}

					<div className="space-y-2">
						<label className="text-sm text-gray-700 dark:text-gray-300">{t('slippageTolerance')} (%)</label>
						<Input
							type="number"
							placeholder="0.5"
							value={slippage}
							onChange={(e) => { setSlippage(e.target.value); setError(null); setSuccess(null) }}
							className="border-orange-300 dark:border-gray-600 bg-orange-50 dark:bg-gray-700/50 text-gray-900 dark:text-white animated-input"
						/>
					</div>

					<Button
						onClick={handleAddLiquidity}
						disabled={!mounted ? true : (!isConnected || submitting)}
						className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 animated-button"
					>
						{submitting ? <span className="loading-dots">{t('submitting')}</span> : t('addLiquidity')}
					</Button>
				</CardContent>
			</Card>

			<Card className="bg-white/80 dark:bg-gray-800/50 border-orange-200 dark:border-gray-700 shadow-lg animated-card backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-gray-900 dark:text-white gradient-text">{t('myPosition')}</CardTitle>
				</CardHeader>
				<CardContent>
					{(poolInfo && poolInfo.exists && lpBalance > 0n) && isConnected ? (
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div className="text-gray-600 dark:text-gray-400">{t('lpContract')}</div>
							<div className="text-gray-900 dark:text-white break-all">{pairAddress}</div>
							<div className="text-gray-600 dark:text-gray-400">{t('myLP')}</div>
							<div className="text-gray-900 dark:text-white">{lpBalance.toString()}</div>
							<div className="text-gray-600 dark:text-gray-400">{t('sharePercentage')}</div>
							<div className="text-gray-900 dark:text-white">{(positionShare * 100).toFixed(4)}%</div>
							<div className="text-gray-600 dark:text-gray-400">{t('corresponding')} {token0.symbol}</div>
							<div className="text-gray-900 dark:text-white">{formatUnits(underlying0, token0.decimals)} {token0.symbol}</div>
							<div className="text-gray-600 dark:text-gray-400">{t('corresponding')} {token1.symbol}</div>
							<div className="text-gray-900 dark:text-white">{formatUnits(underlying1, token1.decimals)} {token1.symbol}</div>
						</div>
					) : (
						<div className="text-center py-8">
							<div className="text-gray-600 dark:text-gray-400 mb-2">{t('noLiquidityPosition')}</div>
							<div className="text-sm text-gray-500 dark:text-gray-500">{t('addLiquidityToSeePosition')}</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}