import { db } from '@src/services/database';

export async function mine(req: ApiRequest, res: ApiResponse) {

	const recipes = await db.selectFrom('recipe')
		.where('author_id', "=", req.auth!.id)
		.selectAll()
		.execute();

	res.json(recipes);
}