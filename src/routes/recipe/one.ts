import { db } from '@src/services/database';
import { z, object } from 'zod';
import { withIngredients } from '@src/utils/query';

export const oneSchema = object({
	id: z.number(),
});

export async function one(req: ApiRequest<typeof oneSchema>, res: ApiResponse) {

	const recipe = await db.selectFrom('recipe')
		.where('recipe.id', "=", req.body.id)
		.selectAll()
		.select((eb) => [withIngredients(eb)])
		.executeTakeFirstOrThrow();

	res.json(recipe);
}