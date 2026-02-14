import { useMutation, useQueryClient } from '@tanstack/react-query'
import { coinsApi } from '../lib/api'
import type { Coin } from '../types/coin'
import type { BatchCreateResponse } from '../types/importTypes'

const COINS_QUERY_KEY = ['coins']

export function useImportCoins() {
  const queryClient = useQueryClient()

  return useMutation<
    BatchCreateResponse,
    Error,
    Omit<Coin, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]
  >({
    mutationFn: (coins) => coinsApi.batchCreate(coins),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COINS_QUERY_KEY })
    },
  })
}
