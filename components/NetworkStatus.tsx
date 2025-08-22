'use client'

import { useAccount, useChainId } from 'wagmi'
import { AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

const NetworkStatus = () => {
	const chainId = useChainId()
	const { isConnected } = useAccount()
	const [mounted, setMounted] = useState(false)

	// 确保只在客户端渲染
	useEffect(() => {
		setMounted(true)
	}, [])

	// 服务端渲染时不显示任何内容
	if (!mounted) return null

	if (!isConnected) return null

	if (chainId !== 11155111) {
		return (
			<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
				<div className="flex items-center space-x-2">
					<AlertTriangle className="h-4 w-4 text-yellow-500" />
					<span className="text-yellow-500 text-sm">
						请切换到 Sepolia 测试网
					</span>
				</div>
			</div>
		)
	}

	return null
}

export default NetworkStatus