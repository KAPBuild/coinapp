import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { createDb, schema } from '../db'
import { hashPassword, verifyPassword } from '../utils/crypto'
import { createSession, deleteSession, validateSession } from '../utils/sessions'
import { authRateLimit, trackFailedLogin, clearFailedLogins, isAccountLocked } from '../middleware/rateLimit'

const app = new Hono()

// Apply rate limiting to auth endpoints
app.use('/register', authRateLimit)
app.use('/login', authRateLimit)

// POST /api/auth/register
app.post('/register', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const { email, password } = await c.req.json() as { email: string; password: string }

    // Validation
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 409)
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const userId = crypto.randomUUID()

    await db.insert(schema.users).values({
      id: userId,
      email,
      password: hashedPassword,
    })

    // Create session
    const { token, expiresAt } = await createSession(db, userId)

    return c.json(
      {
        user: { id: userId, email, isAdmin: false },
        token,
        expiresAt,
      },
      201
    )
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// POST /api/auth/login
app.post('/login', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const { email, password } = await c.req.json() as { email: string; password: string }

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Check if account is locked
    const lockStatus = isAccountLocked(email)
    if (lockStatus.locked) {
      return c.json({
        error: `Account temporarily locked. Try again in ${lockStatus.lockoutMinutes} minutes.`,
      }, 423)
    }

    // Find user
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (!user) {
      // Track failed attempt even for non-existent users (prevents user enumeration)
      trackFailedLogin(email)
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      // Track failed login attempt
      const result = trackFailedLogin(email)
      if (result.locked) {
        return c.json({
          error: `Too many failed attempts. Account locked for ${result.lockoutMinutes} minutes.`,
        }, 423)
      }
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Clear failed login attempts on successful login
    clearFailedLogins(email)

    // Create session
    const { token, expiresAt } = await createSession(db, user.id)

    return c.json({
      user: { id: user.id, email: user.email, isAdmin: !!user.isAdmin },
      token,
      expiresAt,
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// POST /api/auth/logout
app.post('/logout', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const authHeader = c.req.header('Authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      await deleteSession(db, token)
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ error: 'Logout failed' }, 500)
  }
})

// GET /api/auth/me - Validate session and get user info
app.get('/me', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const session = await validateSession(db, token)

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401)
    }

    const [user] = await db
      .select({ id: schema.users.id, email: schema.users.email, isAdmin: schema.users.isAdmin })
      .from(schema.users)
      .where(eq(schema.users.id, session.userId))
      .limit(1)

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user: { ...user, isAdmin: !!user.isAdmin } })
  } catch (error) {
    console.error('Auth check error:', error)
    return c.json({ error: 'Failed to validate session' }, 500)
  }
})

export default app
