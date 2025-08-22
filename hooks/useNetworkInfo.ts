'use client'

import { useChainId, useAccount } from 'wagmi'
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains'

export function useNetworkInfo() {
  const chainId = useChainId()
  const { isConnected } = useAccount()

  // 网络信息映射
  const networkInfo = {
    [sepolia.id]: {
      name: 'Sepolia Testnet',
      color: 'green',
      bgColor: 'from-green-100 to-green-200',
      textColor: 'text-green-800',
      icon: '🟢'
    },
    [mainnet.id]: {
      name: 'Ethereum Mainnet',
      color: 'blue',
      bgColor: 'from-blue-100 to-blue-200',
      textColor: 'text-blue-800',
      icon: '🔵'
    },
    [polygon.id]: {
      name: 'Polygon',
      color: 'purple',
      bgColor: 'from-purple-100 to-purple-200',
      textColor: 'text-purple-800',
      icon: '🟣'
    },
    [arbitrum.id]: {
      name: 'Arbitrum',
      color: 'blue',
      bgColor: 'from-blue-100 to-blue-200',
      textColor: 'text-blue-800',
      icon: '🔵'
    },
    [optimism.id]: {
      name: 'Optimism',
      color: 'red',
      bgColor: 'from-red-100 to-red-200',
      textColor: 'text-red-800',
      icon: '🔴'
    }
  }

  // 获取当前网络信息
  const currentNetwork = networkInfo[chainId as keyof typeof networkInfo]
  
  // 如果未连接或网络不支持，返回默认值
  if (!isConnected || !currentNetwork) {
    return {
      name: '未连接',
      color: 'gray',
      bgColor: 'from-gray-100 to-gray-200',
      textColor: 'text-gray-800',
      icon: '⚪',
      isConnected: false,
      chainId: null
    }
  }

  return {
    ...currentNetwork,
    isConnected: true,
    chainId
  }
}
