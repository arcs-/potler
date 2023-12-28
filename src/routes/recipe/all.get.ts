import { db } from '@src/services/database';
import { z, object } from 'zod';
import { withIngredients } from '@src/utils/query';
import { StatusCodes } from 'http-status-codes';

export const allSchema = object({
	limit: z.number().optional(),
});

export async function all(req: ApiRequest<typeof allSchema>, res: ApiResponse) {
	if (!req.auth!.admin) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({
				state: 'error',
				message: 'You are not allowed to do this.'
			});
	}

	const recipes = await db.selectFrom('recipe')
		.selectAll()
		.select((eb) => [withIngredients(eb)])
		.execute();

	res.json(recipes);
}