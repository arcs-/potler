import type { Insertable } from 'kysely'
import { z, object } from 'zod'
import argon2 from '@node-rs/argon2'
import { StatusCodes } from 'http-status-codes'
import { db } from '~/server/storage/db'
import type { User } from '~/types/kysely'
import { createSession } from '~/server/utils/auth'

export const registerSchema = object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)

  const newUser: Insertable<User> = {
    email: body.email,
    name: body.name,
  }

  const existing = await db.selectFrom('user')
    .where('email', '=', body.email)
    .select(['id'])
    .executeTakeFirst()
  if (existing) {
    setResponseStatus(event, StatusCodes.BAD_REQUEST)
    throw new Error('User already exists')
  }

  if (body.password) {
    newUser.login_hash = await argon2.hash(body.password)
  }

  const inserted = await db.insertInto('user')
    .values(newUser)
    .returningAll()
    .executeTakeFirstOrThrow()
  inserted.login_hash = null

  createSession(event, inserted)

  return {
    user: inserted,
  }
})
