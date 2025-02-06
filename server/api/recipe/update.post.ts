/* eslint-disable @stylistic/newline-per-chained-call */

import type { Insertable, Updateable } from 'kysely'
import { z, object } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { db } from '~/server/storage/db'
import type { Ingredient, Recipe } from '~/types/kysely'

export const updateSchema = object({
  id: z.number(),
  name: z.string().max(255).min(5),
  description: z.string().max(1024).optional(),
  instructions: z.string().max(1024).optional(),
  source: z.string().max(1024).optional(),
  cover: z.string().max(1024).optional(),
  ingredients: z.array(z.object({
    name: z.string().max(255).min(2),
    amount: z.string(),
    // unit: z.string().max(255).min(1).optional(),
    // optional: z.coerce.number().optional(),
    order: z.coerce.number().optional(),
  })).min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, updateSchema.parse)
  const auth = getAuth(event)

  const recipeCheck = await db.selectFrom('recipe')
    .where('recipe.id', '=', body.id)
    .select('author_id')
    .executeTakeFirstOrThrow()

  if (recipeCheck.author_id !== auth.id && auth.admin) {
    setResponseStatus(event, StatusCodes.BAD_REQUEST)
    return {
      state: 'error',
      message: 'You are not allowed to delete this recipe.',
    }
  }

  const recipeToInsert: Updateable<Recipe> = {
    name: body.name,
    description: body.description,
    instructions: body.instructions,
    source: body.source,
    cover: body.cover,
  }

  const recipe = await db.updateTable('recipe')
    .set(recipeToInsert)
    .where('recipe.id', '=', body.id)
    .returningAll()
    .executeTakeFirst()

  await db.deleteFrom('ingredient')
    .where('recipe_id', '=', body.id)
    .execute()

  const ingredientsToInsert: Array<Insertable<Ingredient>> = body.ingredients.map(ingredient => ({
    recipe_id: body.id,
    name: ingredient.name,
    amount: ingredient.amount,
    // unit: ingredient.unit,
    order: ingredient.order,
  }))

  const ingredients = await db.insertInto('ingredient')
    .values(ingredientsToInsert)
    .returningAll()
    .executeTakeFirstOrThrow()

  return {
    ...recipe,
    ingredients,
  }
})
