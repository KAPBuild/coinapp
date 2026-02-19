import { useQuery } from '@tanstack/react-query'
import { shopApi } from '../lib/api'

const SHOP_QUERY_KEY = ['shop']

export function useShop() {
  return useQuery({
    queryKey: SHOP_QUERY_KEY,
    queryFn: shopApi.getShop,
    staleTime: 60 * 1000, // 1 minute
  })
}
