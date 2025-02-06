import { z, object } from 'zod'
import { db } from '~/server/storage/db'

export const likeSchema = object({
  ids: z.number().array(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, likeSchema.parse)
  const auth = getAuth(event)

  const user = await db.selectFrom('user')
    .where('id', '=', auth.id)
    .select(['family_id'])
    .executeTakeFirstOrThrow()

  await db.insertInto('like')
    .values(body.ids.map(id => ({
      recipe_id: id,
      user_id: auth.id,
      family_id: user.family_id ?? 0,
    })))
    .execute()

  await db.updateTable('recipe')
    .where('id', 'in', body.ids)
    .set(eb => ({
      likes: eb('likes', '+', 1),
    }))
    .execute()

  return {
    state: '👍',
  }
})
