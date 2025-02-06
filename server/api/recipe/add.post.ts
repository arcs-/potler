import type { Insertable } from 'kysely'
import { z, object } from 'zod'
import type { Ingredient, Recipe } from '~/types/kysely'
import { db } from '~/server/storage/db'

export const addSchema = object({
  name: z.string().max(255)
    .min(3),
  description: z.string().max(1024)
    .optional(),
  instructions: z.string().max(1024)
    .optional(),
  source: z.string().max(1024)
    .optional(),
  cover: z.string().max(1024)
    .optional(),
  ingredients: z.array(z.object({
    name: z.string().max(255)
      .min(2),
    amount: z.string(),
    unit: z.string().max(255)
      .min(1)
      .optional(),
    optional: z.boolean().optional(),
    order: z.number().optional(),
  })).min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, addSchema.parse)
  const session = getAuth(event)

  const recipeToInsert: Insertable<Recipe> = {
    name: body.name,
    description: body.description,
    instructions: body.instructions,
    source: body.source,
    cover: body.cover,
    author_id: session.id,
  }

  const recipe = await db.insertInto('recipe')
    .values(recipeToInsert)
    .returningAll()
    .executeTakeFirstOrThrow()

  const ingredientsToInsert: Array<Insertable<Ingredient>> = body.ingredients.map(ingredient => ({
    recipe_id: recipe.id,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
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
