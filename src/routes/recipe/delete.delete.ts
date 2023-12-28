import { db } from '@src/services/database';
import { z, object } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const removeSchema = object({
	id: z.number(),
});

export async function remove(
	req: ApiRequest<typeof removeSchema>,
	res: ApiResponse,
) {

	const recipe = await db.selectFrom('recipe')
		.where('recipe.id', "=", req.body.id)
		.select('author_id')
		.executeTakeFirstOrThrow();

	if (recipe.author_id !== req.auth!.id && !req.auth!.admin) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({
				state: 'error',
				message: 'You are not allowed to delete this recipe.'
			});
	}

	await db.deleteFrom('ingredient')
		.where("recipe_id", "=", req.body.id)
		.execute();

	await db.deleteFrom('recipe')
		.where("id", "=", req.body.id)
		.execute();

	res.json({
		state: 'success'
	});
}