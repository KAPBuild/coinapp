import { pbkdf2 } from '@noble/hashes/pbkdf2'
import { sha256 } from '@noble/hashes/sha256'

const ITERATIONS = 100000
const KEY_LENGTH = 32
const SALT_LENGTH = 16

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const hash = pbkdf2(sha256, password, salt, { c: ITERATIONS, dkLen: KEY_LENGTH })

  // Combine salt and hash for storage
  const combined = new Uint8Array(salt.length + hash.length)
  combined.set(salt)
  combined.set(hash, salt.length)

  return btoa(String.fromCharCode(...combined))
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0))
  const salt = combined.slice(0, SALT_LENGTH)
  const hash = combined.slice(SALT_LENGTH)

  const newHash = pbkdf2(sha256, password, salt, { c: ITERATIONS, dkLen: KEY_LENGTH })

  // Constant-time comparison
  return timingSafeEqual(hash, newHash)
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]
  }
  return result === 0
}

export function generateSessionToken(): string {
  return crypto.randomUUID()
}
