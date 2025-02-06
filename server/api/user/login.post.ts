import { z, object } from 'zod'
import argon2 from '@node-rs/argon2'
import { StatusCodes } from 'http-status-codes'
import { db } from '~/server/storage/db'
import { createSession } from '~/server/utils/auth'

export const loginSchema = object({
  email: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)

  const user = await db.selectFrom('user')
    .where('email', '=', body.email)
    .selectAll()
    .executeTakeFirst()

  if (!user) {
    setResponseStatus(event, StatusCodes.BAD_REQUEST)
    throw new Error('User not found')
  }

  if (!user.login_hash) {
    setResponseStatus(event, StatusCodes.BAD_REQUEST)
    throw new Error('Passwordless login not supported')
  }

  if (user.login_hash) {
    const hashVerified = await argon2.verify(user.login_hash, body.password)
    if (!hashVerified) {
      setResponseStatus(event, StatusCodes.BAD_REQUEST)
      throw new Error('Wrong password')
    }
  }

  createSession(event, user)

  user.login_hash = null
  return { user }
})
