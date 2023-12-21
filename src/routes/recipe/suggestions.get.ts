import { db } from '@src/services/database';
import { z, object } from 'zod';
import { withIngredients } from '@src/utils/query';

export const suggestionsSchema = object({
  position: z.number(),
});

export async function suggestions(req: ApiRequest<typeof suggestionsSchema>, res: ApiResponse) {

  // select likes from other in group

  const suggestions = await db.selectFrom('recipe')
    .limit(20)
    .offset(req.body.position)
    .selectAll()
    .select((eb) => [withIngredients(eb)])
    .execute();

  res.json(suggestions);
}