import { useBalance, useAccount } from 'wagmi'

export function useEthBalance() {
  const { address, isConnected } = useAccount()

  const { data, isLoading, error } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: isConnected && !!address,
    },
  })

  return {
    balance: data?.value || 0n,
    formattedBalance: data?.formatted || '0',
    symbol: data?.symbol || 'ETH',
    isLoading,
    error,
  }
}