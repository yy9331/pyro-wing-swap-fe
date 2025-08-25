'use client'

import { Button } from '@/components/ui/button'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useLanguage } from '@/hooks/useLanguage'
import { shortenAddress } from "@/lib/utils"
import { Wallet, LogOut } from "lucide-react"
import { useState, useEffect } from "react"

export function WalletConnect({ compact = false }: { compact?: boolean }) {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled className="text-gray-500">
        {t('loading')}
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
          {shortenAddress(address)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => disconnect()}
          className="text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 animated-button"
        >
          <LogOut className="h-4 w-4" />
          {!compact && <span className="ml-1 text-xs">{t('disconnect')}</span>}
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 animated-button"
    >
      <Wallet className="h-4 w-4 mr-1" />
      {!compact && <span className="text-xs">{t('connect_wallet')}</span>}
    </Button>
  )
}
