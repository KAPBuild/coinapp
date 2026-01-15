import { Context } from 'hono'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// Note: This resets when the worker restarts. For production at scale,
// consider using Cloudflare KV or their built-in rate limiting product.
const rateLimitStore = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  windowMs: number      // Time window in milliseconds
  maxRequests: number   // Max requests per window
  keyGenerator?: (c: Context) => string  // Custom key generator
  message?: string      // Custom error message
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100,           // 100 requests per 15 minutes
  message: 'Too many requests, please try again later',
}

/**
 * Rate limiting middleware for Hono
 */
export function rateLimit(options: Partial<RateLimitOptions> = {}) {
  const config = { ...defaultOptions, ...options }

  return async (c: Context, next: () => Promise<void>) => {
    // Generate key based on IP or custom function
    const key = config.keyGenerator
      ? config.keyGenerator(c)
      : getClientIP(c)

    const now = Date.now()
    const entry = rateLimitStore.get(key)

    // Clean up old entries periodically (every 100 requests)
    if (Math.random() < 0.01) {
      cleanupExpiredEntries(now)
    }

    if (entry) {
      // Check if window has expired
      if (now > entry.resetTime) {
        // Reset the window
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + config.windowMs,
        })
      } else if (entry.count >= config.maxRequests) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

        c.header('X-RateLimit-Limit', config.maxRequests.toString())
        c.header('X-RateLimit-Remaining', '0')
        c.header('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
        c.header('Retry-After', retryAfter.toString())

        return c.json(
          {
            error: config.message,
            retryAfter,
          },
          429
        )
      } else {
        // Increment count
        entry.count++
        rateLimitStore.set(key, entry)
      }
    } else {
      // First request from this IP
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
    }

    // Set rate limit headers
    const currentEntry = rateLimitStore.get(key)!
    c.header('X-RateLimit-Limit', config.maxRequests.toString())
    c.header('X-RateLimit-Remaining', Math.max(0, config.maxRequests - currentEntry.count).toString())
    c.header('X-RateLimit-Reset', Math.ceil(currentEntry.resetTime / 1000).toString())

    await next()
  }
}

/**
 * Stricter rate limiting for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 10,            // 10 login/register attempts per 15 minutes
  message: 'Too many authentication attempts, please try again in 15 minutes',
})

/**
 * General API rate limiting
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  maxRequests: 60,            // 60 requests per minute
  message: 'Too many requests, please slow down',
})

/**
 * Get client IP from Cloudflare headers
 */
function getClientIP(c: Context): string {
  // Cloudflare provides the real IP in CF-Connecting-IP header
  const cfIP = c.req.header('CF-Connecting-IP')
  if (cfIP) return cfIP

  // Fallback to X-Forwarded-For
  const xForwardedFor = c.req.header('X-Forwarded-For')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  // Fallback to X-Real-IP
  const xRealIP = c.req.header('X-Real-IP')
  if (xRealIP) return xRealIP

  // Default fallback
  return 'unknown'
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Account lockout tracking for failed login attempts
 */
const failedLoginStore = new Map<string, { count: number; lockoutUntil: number }>()

export function trackFailedLogin(email: string): { locked: boolean; lockoutMinutes?: number } {
  const now = Date.now()
  const key = `login:${email.toLowerCase()}`
  const entry = failedLoginStore.get(key)

  if (entry) {
    // Check if currently locked out
    if (entry.lockoutUntil > now) {
      const minutesRemaining = Math.ceil((entry.lockoutUntil - now) / 60000)
      return { locked: true, lockoutMinutes: minutesRemaining }
    }

    // Increment failed attempts
    entry.count++

    // Lock out after 5 failed attempts
    if (entry.count >= 5) {
      entry.lockoutUntil = now + 30 * 60 * 1000  // 30 minute lockout
      failedLoginStore.set(key, entry)
      return { locked: true, lockoutMinutes: 30 }
    }

    failedLoginStore.set(key, entry)
  } else {
    failedLoginStore.set(key, { count: 1, lockoutUntil: 0 })
  }

  return { locked: false }
}

export function clearFailedLogins(email: string) {
  const key = `login:${email.toLowerCase()}`
  failedLoginStore.delete(key)
}

export function isAccountLocked(email: string): { locked: boolean; lockoutMinutes?: number } {
  const now = Date.now()
  const key = `login:${email.toLowerCase()}`
  const entry = failedLoginStore.get(key)

  if (entry && entry.lockoutUntil > now) {
    const minutesRemaining = Math.ceil((entry.lockoutUntil - now) / 60000)
    return { locked: true, lockoutMinutes: minutesRemaining }
  }

  return { locked: false }
}
