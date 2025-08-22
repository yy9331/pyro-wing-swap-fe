'use client'

import { createConfig, WagmiProvider } from 'wagmi'
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { ReactNode } from 'react'
import { injected } from 'wagmi/connectors'
import { LanguageProvider } from '@/hooks/useLanguage'

const config = createConfig({
  chains: [sepolia, mainnet, polygon, arbitrum, optimism],
  connectors: [
    injected({ shimDisconnect: true })
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}