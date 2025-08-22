'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

export type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 翻译文本
const translations = {
  zh: {
    // Header
    'nav.swap': '代币交换',
    'nav.pools': '流动性池',
    'nav.liquidity': '添加流动性',
    'nav.settings': '设置',
    'network': '网络',
    'theme': '主题',
    'wallet': '钱包',
    'language': '语言',
    'not_connected': '未连接',
    
    // Swap Interface
    'swap.title': '代币交换',
    'swap.sell': '出售',
    'swap.buy': '购买',
    'swap.slippage': '滑点容忍度 (%)',
    'swap.button': '交换',
    'swap.loading': '正在计算报价',
    'swap.error': '报价失败，请稍后重试',
    'swap.pool_not_ready': '池未创建或无流动性',
    'balance': '余额',
    'loading': '加载中...',
    
    // Liquidity
    'liquidity.title': '流动性池',
    'liquidity.add': '添加流动性',
    'liquidity.real_time': '实时数据来自区块链',
    'liquidity.active': '活跃',
    
    // Common
    'max': 'MAX',
    'connect_wallet': '连接钱包',
    'disconnect': '断开连接',
    
    // Add Liquidity
    'addLiquidity': '添加流动性',
    'token1': '代币 1',
    'token2': '代币 2',
    'slippageTolerance': '滑点容忍度',
    'submitting': '提交中',
    'myPosition': '我的头寸',
    'lpContract': 'LP 合约',
    'myLP': '我的 LP',
    'sharePercentage': '份额占比',
    'corresponding': '对应',
    'noLiquidityPosition': '暂无流动性头寸',
    'addLiquidityToSeePosition': '添加流动性后，您的头寸将显示在这里',
    
    // Pool Info
    'poolStatus': '池子状态',
    'exists': '已存在',
    'currentRatio': '当前比率',
    'newPool': '新池子',
    'initialRatio': '初始比率',
    'yourSetRatioWillBeInitialPrice': '您设置的比率将成为初始价格',
    'tipFreeRatioSetting': '提示：您可以自由设置任意比例，这将决定代币对的初始价格',
    
    // Liquidity Pools
    'volume24h': '24h 交易量',
    'lpTokens': 'LP 代币',
    'reserves': '储备量',
    'poolNotCreated': '池子未创建',
    'goToAddLiquidityToCreatePool': '前往"添加流动性"创建池子',
    'poolStatusDescription': '池子状态说明',
    'poolCreatedWithLiquidity': '池子已创建且有流动性',
    'needToAddLiquidityFirst': '需要先添加流动性',
    'totalValueLocked': '总锁仓价值',
    'totalValueOfTokensInPool': '池子中代币的总价值',
    'annualPercentageRate': '年化收益率',
    'annualizedReturnBasedOnFees': '基于交易费用的年化收益',
    'totalAmountOfLPTokens': '流动性提供者代币总量',
    'fetchingDataFromBlockchain': '正在从区块链获取数据',
  },
  en: {
    // Header
    'nav.swap': 'Token Swap',
    'nav.pools': 'Liquidity Pools',
    'nav.liquidity': 'Add Liquidity',
    'nav.settings': 'Settings',
    'network': 'Network',
    'theme': 'Theme',
    'wallet': 'Wallet',
    'language': 'Language',
    'not_connected': 'Not Connected',
    
    // Swap Interface
    'swap.title': 'Token Swap',
    'swap.sell': 'Sell',
    'swap.buy': 'Buy',
    'swap.slippage': 'Slippage Tolerance (%)',
    'swap.button': 'Swap',
    'swap.loading': 'Calculating quote...',
    'swap.error': 'Quote failed, please try again later',
    'swap.pool_not_ready': 'Pool not created or no liquidity',
    'balance': 'Balance',
    'loading': 'Loading...',
    
    // Liquidity
    'liquidity.title': 'Liquidity Pools',
    'liquidity.add': 'Add Liquidity',
    'liquidity.real_time': 'Real-time data from blockchain',
    'liquidity.active': 'Active',
    
    // Common
    'max': 'MAX',
    'connect_wallet': 'Connect Wallet',
    'disconnect': 'Disconnect',
    
    // Add Liquidity
    'addLiquidity': 'Add Liquidity',
    'token1': 'Token 1',
    'token2': 'Token 2',
    'slippageTolerance': 'Slippage Tolerance',
    'submitting': 'Submitting',
    'myPosition': 'My Position',
    'lpContract': 'LP Contract',
    'myLP': 'My LP',
    'sharePercentage': 'Share Percentage',
    'corresponding': 'Corresponding',
    'noLiquidityPosition': 'No liquidity position',
    'addLiquidityToSeePosition': 'Your position will appear here after adding liquidity',
    
    // Pool Info
    'poolStatus': 'Pool Status',
    'exists': 'Exists',
    'currentRatio': 'Current Ratio',
    'newPool': 'New Pool',
    'initialRatio': 'Initial Ratio',
    'yourSetRatioWillBeInitialPrice': 'Your set ratio will be the initial price',
    'tipFreeRatioSetting': 'Tip: You can freely set any ratio, which will determine the initial price of the token pair',
    
    // Liquidity Pools
    'volume24h': '24h Volume',
    'lpTokens': 'LP Tokens',
    'reserves': 'Reserves',
    'poolNotCreated': 'Pool not created',
    'goToAddLiquidityToCreatePool': 'Go to "Add Liquidity" to create a pool',
    'poolStatusDescription': 'Pool Status Description',
    'poolCreatedWithLiquidity': 'Pool created with liquidity',
    'needToAddLiquidityFirst': 'You need to add liquidity first',
    'totalValueLocked': 'Total Value Locked',
    'totalValueOfTokensInPool': 'Total value of tokens in the pool',
    'annualPercentageRate': 'Annual Percentage Rate',
    'annualizedReturnBasedOnFees': 'Annualized return based on fees',
    'totalAmountOfLPTokens': 'Total amount of LP tokens',
    'fetchingDataFromBlockchain': 'Fetching data from blockchain',
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // 从localStorage读取保存的语言设置
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
