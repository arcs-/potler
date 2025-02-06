import { z, object } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { db } from '~/server/storage/db'

export const removeSchema = object({
  id: z.number(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, removeSchema.parse)
  const auth = getAuth(event)

  const recipe = await db.selectFrom('recipe')
    .where('recipe.id', '=', body.id)
    .select('author_id')
    .executeTakeFirstOrThrow()

  if (recipe.author_id !== auth.id && auth.admin) {
    setResponseStatus(event, StatusCodes.FORBIDDEN)
    return {
      state: 'error',
      message: 'You are not allowed to delete this recipe.',
    }
  }

  await db.deleteFrom('ingredient')
    .where('recipe_id', '=', body.id)
    .execute()

  await db.deleteFrom('recipe')
    .where('id', '=', body.id)
    .execute()

  return {
    state: 'success',
  }
})
