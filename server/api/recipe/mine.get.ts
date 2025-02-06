import { db } from '~/server/storage/db'

export default defineEventHandler(async (event) => {
  const auth = getAuth(event)

  const recipes = await db.selectFrom('recipe')
    .where('author_id', '=', auth.id)
    .selectAll()
    .execute()

  return recipes
})
