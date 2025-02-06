import { db } from '~/server/storage/db'

export default defineEventHandler(async (event) => {
  let session
  try {
    session = getAuth(event)
  } catch {
    return null
  }

  const user = await db.selectFrom('user')
    .where('id', '=', session.id)
    .selectAll()
    .executeTakeFirstOrThrow()
  user.login_hash = null

  const family = await db.selectFrom('user')
    .where('family_id', '=', user.family_id)
    .select(['id', 'email', 'name'])
    .execute()

  return {
    user,
    family,
  }
})
