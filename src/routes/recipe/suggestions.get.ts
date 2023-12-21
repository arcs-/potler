import { db } from '@src/services/database';
import { z, object } from 'zod';
import { withIngredients } from '@src/utils/query';

const chunkSize = 30;

export const suggestionsSchema = object({
  position: z.number(),
});

export async function suggestions(req: ApiRequest<typeof suggestionsSchema>, res: ApiResponse) {

  // select likes from other in group
  const user = await db.selectFrom('user')
    .where('id', "=", req.auth!.id)
    .select(['family_id'])
    .executeTakeFirstOrThrow();

  const fromOthers = await db.selectFrom('recipe')
    .innerJoin('like', 'like.recipe_id', 'recipe.id')
    .where('like.family_id', '=', user.family_id)
    .where('like.user_id', '!=', req.auth!.id)
    .selectAll()
    .select((eb) => [withIngredients(eb)])
    .groupBy('recipe.id')
    .execute();

  // select some new ones
  const suggestions = await db.selectFrom('recipe')
    .limit(Math.min(5, fromOthers.length - chunkSize))
    .offset(req.body.position)
    .selectAll()
    .select((eb) => [withIngredients(eb)])
    .execute();

  // okay
  res.json([
    ...fromOthers,
    ...suggestions
  ]);
}