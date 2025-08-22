'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import { TEST_TOKENS } from '@/lib/constants'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

export function TokenInput({
  label,
  value,
  onChange,
  onMax,
  symbol,
  logo,
  balanceText,
  onTokenSelect,
  excludeSymbol,
  onFocus,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onMax: () => void
  symbol: string
  logo: string
  balanceText: string | React.ReactNode
  onTokenSelect?: (tokenSymbol: keyof typeof TEST_TOKENS) => void
  excludeSymbol?: string
  onFocus?: () => void
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (showDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(target) &&
          buttonRef.current &&
          !buttonRef.current.contains(target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleTokenSelect = (tokenSymbol: keyof typeof TEST_TOKENS) => {
    if (onTokenSelect) {
      onTokenSelect(tokenSymbol)
    }
    setShowDropdown(false)
  }

  // 过滤掉已选择的代币
  const getAvailableTokens = () => {
    if (!excludeSymbol) return Object.entries(TEST_TOKENS)
    return Object.entries(TEST_TOKENS).filter(([symbol]) => symbol !== excludeSymbol)
  }

  return (
    <div className="space-y-2">
      <label className="text-base text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-orange-50 dark:bg-gray-700/50 rounded-lg animated-input relative">
        <Input
          type="number"
          placeholder="0.0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="border-0 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 flex-1 cursor-text"
          style={{ pointerEvents: 'auto' }}
        />
        <div className="flex items-center space-x-2 relative">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMax} 
            disabled={!mounted}
            className="border-orange-300 dark:border-gray-600 text-gray-700 dark:text-white text-sm px-3 py-2 h-10 animated-button"
          >
            {t('max')}
          </Button>
          <div className="relative flex-1 sm:flex-none">
            <Button 
              variant="outline" 
              className="border-orange-300 dark:border-gray-600 text-gray-900 dark:text-white w-full sm:min-w-[100px] h-10 animated-button"
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={!mounted}
              ref={buttonRef}
            >
              <span className="mr-2">{logo}</span>
              <span className="hidden sm:inline">{symbol}</span>
              <span className="sm:hidden">{symbol}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            {showDropdown && onTokenSelect && (
              <div 
                className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto" 
                ref={dropdownRef}
                style={{ 
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  width: '100%',
                  zIndex: 9999
                }}
              >
                {getAvailableTokens().map(([tokenSymbol, token]) => (
                  <button
                    key={tokenSymbol}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 text-left cursor-pointer transition-colors"
                    onClick={() => handleTokenSelect(tokenSymbol as keyof typeof TEST_TOKENS)}
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
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {t('balance')}: {typeof balanceText === 'string' ? `${balanceText} ${symbol}` : balanceText}
      </div>
    </div>
  )
}


