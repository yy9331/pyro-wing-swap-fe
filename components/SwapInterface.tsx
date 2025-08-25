'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { useSwap } from '@/hooks/useSwap'
import { TEST_TOKENS } from '@/lib/constants'
import { TokenInput } from '@/components/add-liquidity/TokenInput'
import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

export function SwapInterface() {
  const {
    // State
    fromToken,
    toToken,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    loadingQuote,
    quoteError,
    pairReady,
    setActiveField,
    mounted,
    submitting,
    txError,
    txSuccess,
    slippage,
    setSlippage,
    currentBalance,
    
    // Actions
    handleMax,
    handleSwap,
    setFromToken,
    setToToken,
  } = useSwap()

  const { t } = useLanguage()
  const [showToDropdown, setShowToDropdown] = useState(false)
  const toButtonRef = useRef<HTMLButtonElement>(null)
  const toDropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (showToDropdown && 
          toDropdownRef.current && 
          !toDropdownRef.current.contains(target) &&
          toButtonRef.current &&
          !toButtonRef.current.contains(target)) {
        setShowToDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showToDropdown])

  // 服务端渲染时显示加载状态
  if (!mounted) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/50 border-orange-200 dark:border-gray-700 shadow-lg animated-card relative z-20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white gradient-text">{t('swap.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="pulse-loading"></div>
              <span className="text-gray-600 dark:text-gray-400">加载中...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleFromTokenSelect = (tokenSymbol: keyof typeof TEST_TOKENS) => {
    setFromToken(TEST_TOKENS[tokenSymbol])
    setFromAmount('')
    setToAmount('')
  }

  const handleToTokenSelect = (tokenSymbol: keyof typeof TEST_TOKENS) => {
    setToToken(TEST_TOKENS[tokenSymbol])
    setFromAmount('')
    setToAmount('')
    setShowToDropdown(false)
  }

  const getAvailableTokens = (excludeSymbol: string) => {
    return Object.entries(TEST_TOKENS).filter(([symbol]) => symbol !== excludeSymbol)
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/50 border-orange-200 dark:border-gray-700 shadow-lg animated-card backdrop-blur-sm relative z-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white gradient-text" data-text={t('swap.title')}>{t('swap.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative z-30">
        {txError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-600 dark:text-red-300 animated-card relative z-40">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full breathing-light"></div>
              {txError}
            </div>
          </div>
        )}
        {txSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-600 dark:text-green-300 animated-card relative z-40">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full breathing-light"></div>
              {txSuccess}
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="relative z-40">
          <TokenInput
            label={t('swap.sell')}
            value={fromAmount}
            onChange={setFromAmount}
            onMax={handleMax}
            symbol={fromToken.symbol}
            logo={fromToken.logo}
            balanceText={currentBalance.isLoading ? (
              <span className="flex items-center">
                <div className="pulse-loading mr-1"></div>
                {t('loading')}
              </span>
            ) : (
              formatNumber(currentBalance.formatted)
            )}
            onTokenSelect={handleFromTokenSelect}
            excludeSymbol={toToken.symbol}
            onFocus={() => setActiveField('from')}
          />
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center relative">
          <div className="bg-orange-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-md" style={{ pointerEvents: 'none' }} aria-hidden>
            <ArrowDown className="h-4 w-4 m-2" />
          </div>
        </div>
        
        {/* To Token */}
        <div className="relative z-40">
          {!pairReady && (
            <div className="text-sm text-amber-600 dark:text-amber-400 mb-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full breathing-light"></div>
              {fromToken.symbol}/{toToken.symbol} {t('swap.pool_not_ready')}
            </div>
          )}
          {quoteError === 'ROUTER_REVERT' && (
            <div className="text-sm text-red-600 dark:text-red-400 mb-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full breathing-light"></div>
              {t('swap.error')}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-base text-gray-700 dark:text-gray-300">{t('swap.buy')}</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-orange-50 dark:bg-gray-700/50 rounded-lg animated-input relative">
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="border-0 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 flex-1 cursor-text"
                style={{ pointerEvents: 'auto' }}
              />
              <div className="relative flex-1 sm:flex-none">
                <Button 
                  variant="outline" 
                  className="border-orange-300 dark:border-gray-600 text-gray-900 dark:text-white w-full sm:min-w-[100px] animated-button"
                  onClick={() => setShowToDropdown(!showToDropdown)}
                  disabled={!mounted}
                  ref={toButtonRef}
                >
                  <span className="mr-2">{toToken.logo}</span>
                  <span className="hidden sm:inline">{toToken.symbol}</span>
                  <span className="sm:hidden">{toToken.symbol}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                {showToDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto" 
                    ref={toDropdownRef}
                    style={{ 
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '4px',
                      width: '100%',
                      zIndex: 9999
                    }}
                  >
                    {getAvailableTokens(fromToken.symbol).map(([symbol, token]) => (
                      <button
                        key={symbol}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-gray-600 text-left cursor-pointer transition-colors"
                        onClick={() => handleToTokenSelect(symbol as keyof typeof TEST_TOKENS)}
                        style={{ 
                          pointerEvents: 'auto',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 10000
                        }}
                      >
                        <span className="mr-2 text-base">{token.logo}</span>
                        <span className="text-sm font-medium">{token.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {loadingQuote && (
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2 mt-2">
              <div className="pulse-loading"></div>
              <span>{t('swap.loading')}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 relative z-30">
          <label className="text-base text-gray-700 dark:text-gray-300">{t('swap.slippage')}</label>
          <Input
            type="number"
            placeholder="0.5"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="border-orange-300 dark:border-gray-600 bg-orange-50 dark:bg-gray-700/50 text-gray-900 dark:text-white animated-input cursor-text"
            style={{ pointerEvents: 'auto' }}
          />
        </div>

        {/* Swap Button */}
        <Button 
          onClick={handleSwap} 
          disabled={!pairReady || submitting || loadingQuote || !fromAmount || !toAmount}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animated-button text-lg"
        >
          {submitting ? (
            <div className="flex items-center space-x-2">
              <div className="pulse-loading"></div>
              <span>{t('loading')}</span>
            </div>
          ) : (
            t('swap.button')
          )}
        </Button>
      </CardContent>
    </Card>
  )
}