import { env } from 'process'
import jwt from 'jsonwebtoken'
import type { Selectable } from 'kysely'
import type { User } from '~/types/kysely'

const COOKIE_NAME = 'session'

export interface AuthBody {
  id: number
  family_id: number | null
  email: string
  admin: boolean
}

export function createSession(event: any, user: Selectable<User>) {
  const runtimeConfig = useRuntimeConfig()
  const token = jwt.sign(
    {
      id: user.id,
      family_id: user.family_id,
      email: user.email,
      admin: user.id === 1,
    } as AuthBody,
    runtimeConfig.tokenSecret,
    { expiresIn: '12 Weeks' },
  )

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV !== 'development',
    sameSite: 'strict',
  })
}

export function destroySession(event: any) {
  deleteCookie(event, COOKIE_NAME)
}

export function getSessionUser(event: any) {
  const bearer = getCookie(event, COOKIE_NAME)
  if (!bearer) return null
  return jwt.decode(bearer)
}

export function getAuth(event: any) {
  const body = event.context.auth as AuthBody
  if (!body) {
    throw new Error('Not authenticated')
  }
  return body
}
