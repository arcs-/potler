import type { ExpressionBuilder } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/sqlite'
import type { DB } from '~/types/kysely'

export function withIngredients(eb: ExpressionBuilder<DB, 'recipe'>) {
  return jsonArrayFrom(
    eb.selectFrom('ingredient')
      .select(['id', 'name', 'amount'])
      .whereRef('ingredient.recipe_id', '=', 'recipe.id'),
  ).as('ingredients')
}
