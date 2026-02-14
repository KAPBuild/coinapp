import { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { createDb, schema } from '../db'
import { validateSession } from '../utils/sessions'

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const db = createDb(c.env.DB as D1Database)
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)
  const session = await validateSession(db, token)

  if (!session) {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }

  // Fetch user to get admin status
  const [user] = await db
    .select({ id: schema.users.id, isAdmin: schema.users.isAdmin })
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .limit(1)

  // Attach userId and isAdmin to context for use in route handlers
  c.set('userId', session.userId)
  c.set('isAdmin', !!user?.isAdmin)

  await next()
}
