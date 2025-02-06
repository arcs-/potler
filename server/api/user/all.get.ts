import { db } from '~/server/storage/db'

export default defineEventHandler(async (event) => {
  const session = getAuth(event)
  if (!session.admin) throw new Error('Not authorized')

  const users = await db.selectFrom('user')
    .selectAll()
    .execute()

  return users
})
