import { type ClassValue, clsx } from "clsx"
import { formatUnits } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K'
  }
  return num.toFixed(decimals)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format large numbers for display
 * 格式化大数字用于显示
 */
export function formatLargeNumber(num: number): string {
  if (num === 0) return '0'
  
  const absNum = Math.abs(num)
  
  if (absNum >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T'
  } else if (absNum >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  } else {
    return num.toFixed(2)
  }
}

/**
 * Format currency for display
 * 格式化货币用于显示
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  if (amount === 0) return `${currency}0.00`
  
  const absAmount = Math.abs(amount)
  
  if (absAmount >= 1e12) {
    return `${currency}${(amount / 1e12).toFixed(2)}T`
  } else if (absAmount >= 1e9) {
    return `${currency}${(amount / 1e9).toFixed(2)}B`
  } else if (absAmount >= 1e6) {
    return `${currency}${(amount / 1e6).toFixed(2)}M`
  } else if (absAmount >= 1e3) {
    return `${currency}${(amount / 1e3).toFixed(2)}K`
  } else {
    return `${currency}${amount.toFixed(2)}`
  }
}

/**
 * Format percentage for display
 * 格式化百分比用于显示
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  if (value === 0) return '0.00%'
  
  const absValue = Math.abs(value)
  
  if (absValue >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K%`
  } else {
    return `${value.toFixed(decimals)}%`
  }
}

/**
 * Convert wei to token units with proper formatting
 * 将wei转换为代币单位并进行适当格式化
 */
export function formatTokenAmount(weiAmount: string | number | bigint, decimals: number = 18): string {
  try {
    const amount = typeof weiAmount === 'string' ? BigInt(weiAmount) : BigInt(weiAmount)
    const formatted = parseFloat(formatUnits(amount, decimals))
    return formatLargeNumber(formatted)
  } catch (error) {
    console.error('Error formatting token amount:', error)
    return '0'
  }
}