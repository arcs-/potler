import type { Selectable } from 'kysely'
import { z, object } from 'zod'
import { db } from '~/server/storage/db'
import type { Ingredient, Recipe } from '~/types/kysely'

const chunkSize = 100

export const suggestionsSchema = object({
  position: z.coerce.number().min(0),
})

type RecipeWithIngredients = Selectable<Recipe> & { ingredients: Selectable<Ingredient>[] }

export default defineEventHandler(async (event) => {
  const body = await getValidatedQuery(event, suggestionsSchema.parse)

  let fromOthers: RecipeWithIngredients[]
  try {
    const auth = getAuth(event)

    // select likes from other in group
    const user = await db.selectFrom('user')
      .where('id', '=', auth.id)
      .select(['family_id'])
      .executeTakeFirstOrThrow()

    fromOthers = await db.selectFrom('recipe')
      .innerJoin('like', 'like.recipe_id', 'recipe.id')
      .where('like.family_id', '=', user.family_id)
      .where('like.user_id', '!=', auth.id)
      .selectAll()
      .select(eb => [withIngredients(eb)])
      .groupBy('recipe.id')
      .execute()
  } catch {
    fromOthers = []
  }

  // select some new ones
  const suggestions = await db.selectFrom('recipe')
    .limit(Math.min(5, fromOthers.length - chunkSize))
    .offset(body.position)
    .selectAll()
    .select(eb => [withIngredients(eb)])
    .execute()

  // okay
  return {
    recipes: [
      ...fromOthers,
      ...suggestions,
    ] as RecipeWithIngredients[],
  }
})
