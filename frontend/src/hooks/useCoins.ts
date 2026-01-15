import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coinsApi } from '../lib/api'
import { Coin } from '../types/coin'

const COINS_QUERY_KEY = ['coins']

export function useCoins() {
  return useQuery({
    queryKey: COINS_QUERY_KEY,
    queryFn: coinsApi.getAll,
  })
}

export function useCreateCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (coin: Omit<Coin, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      coinsApi.create(coin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COINS_QUERY_KEY })
    },
  })
}

export function useUpdateCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, coin }: { id: string; coin: Partial<Coin> }) =>
      coinsApi.update(id, coin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COINS_QUERY_KEY })
    },
  })
}

export function useDeleteCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => coinsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COINS_QUERY_KEY })
    },
  })
}
