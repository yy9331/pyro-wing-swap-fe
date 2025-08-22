import { useReadContract } from 'wagmi'
import { erc20Abi } from '@/lib/contract'
import { TEST_TOKENS } from '@/lib/constants'

export function useTokenBalance(tokenSymbol: keyof typeof TEST_TOKENS, address?: string, isConnected?: boolean) {
  const token = TEST_TOKENS[tokenSymbol]

  const { data: balance, isLoading, error } = useReadContract({
    address: token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address && !!token.address,
    },
  })

  return {
    balance: balance || 0n,
    formattedBalance: balance ? Number(balance) / 10 ** token.decimals : 0,
    isLoading,
    error,
  }
}