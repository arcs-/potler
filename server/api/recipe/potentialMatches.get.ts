import { db } from '~/server/storage/db'

export default defineEventHandler(async (event) => {
  const auth = getAuth(event)

  if (!auth.family_id) return {
    potentialMatches: [],
  }

  const potentialMatches = await db.selectFrom('like')
    .where('family_id', '=', auth.family_id)
    .where('user_id', '!=', auth.id)
    .select(['recipe_id', 'user_id'])
    .execute()

  return { potentialMatches }
})
