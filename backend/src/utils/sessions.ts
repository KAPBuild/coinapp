import { eq, lt } from 'drizzle-orm'
import type { DB } from '../db'
import { schema } from '../db'
import { generateSessionToken } from './crypto'

const SESSION_DURATION_DAYS = 30

export async function createSession(db: DB, userId: string) {
  const token = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  await db.insert(schema.sessions).values({
    id: crypto.randomUUID(),
    userId,
    token,
    expiresAt: expiresAt.toISOString(),
  })

  return { token, expiresAt }
}

export async function validateSession(db: DB, token: string) {
  const [session] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.token, token))
    .limit(1)

  if (!session) return null

  // Check if expired
  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, session.id))
    return null
  }

  return session
}

export async function deleteSession(db: DB, token: string) {
  await db.delete(schema.sessions).where(eq(schema.sessions.token, token))
}

export async function cleanExpiredSessions(db: DB) {
  const now = new Date().toISOString()
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, now))
}
