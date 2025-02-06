import { StatusCodes } from 'http-status-codes'
import { db } from '~/server/storage/db'

export default defineEventHandler(async (event) => {
  // const session = getAuth(event)
  // if (!session.admin) {
  //   setResponseStatus(event, StatusCodes.FORBIDDEN)
  //   throw new Error('Unauthorized')
  // }

  const recipes = await db.selectFrom('recipe')
    .where('author_id', '=', 1)
    .selectAll()
    .select(eb => [withIngredients(eb)])
    .execute()

  return { recipes }
})
