import * as schema from './schema'

// Simple in-memory store for MVP
interface StoredUser {
  id: string
  email: string
  password: string
  createdAt: string
}

interface StoredCoin {
  id: string
  userId: string
  name: string
  description?: string
  quantity: number
  purchasePrice: number
  currentPrice?: number
  bullionValue?: number
  meltValue?: number
  grading?: string
  notes?: string
  purchaseDate: string
  createdAt: string
  updatedAt: string
}

class Database {
  private users: StoredUser[] = []
  private coins: StoredCoin[] = []

  getAllCoins(userId: string) {
    return this.coins.filter(c => c.userId === userId)
  }

  addCoin(coin: StoredCoin) {
    this.coins.push(coin)
    return coin
  }

  updateCoin(id: string, updates: Partial<StoredCoin>) {
    const idx = this.coins.findIndex(c => c.id === id)
    if (idx === -1) return null
    this.coins[idx] = { ...this.coins[idx], ...updates }
    return this.coins[idx]
  }

  deleteCoin(id: string) {
    this.coins = this.coins.filter(c => c.id !== id)
  }

  addUser(user: StoredUser) {
    this.users.push(user)
    return user
  }

  getUserByEmail(email: string) {
    return this.users.find(u => u.email === email)
  }
}

export const db = new Database()
