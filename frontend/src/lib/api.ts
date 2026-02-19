import { Coin } from '../types/coin'
import type { BatchCreateResponse } from '../types/importTypes'
import type { ShopResponse, CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '../types/shopTypes'

// Use deployed Cloudflare backend
const API_URL = import.meta.env.VITE_API_URL || 'https://coinapp-api.kapp-build.workers.dev'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new ApiError(response.status, error.error || 'Request failed')
  }

  return response.json()
}

// Coin API functions
export const coinsApi = {
  getAll: () => apiRequest<Coin[]>('/api/coins'),

  create: (coin: Omit<Coin, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Coin>('/api/coins', {
      method: 'POST',
      body: JSON.stringify(coin),
    }),

  update: (id: string, coin: Partial<Coin>) =>
    apiRequest<Coin>(`/api/coins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coin),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/coins/${id}`, {
      method: 'DELETE',
    }),

  batchCreate: (coins: Omit<Coin, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]) =>
    apiRequest<BatchCreateResponse>('/api/coins/batch', {
      method: 'POST',
      body: JSON.stringify({ coins }),
    }),
}

// Shop API functions (public, no auth required)
export const shopApi = {
  getShop: () => apiRequest<ShopResponse>('/api/shop'),

  createPaymentIntent: (data: CreatePaymentIntentRequest) =>
    apiRequest<CreatePaymentIntentResponse>('/api/checkout/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
