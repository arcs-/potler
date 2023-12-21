import { db } from '@src/services/database';

export async function otherLikes(req: ApiRequest, res: ApiResponse) {

	const user = await db.selectFrom('user')
		.where('id', "=", req.auth!.id)
		.select(['family_id'])
		.executeTakeFirstOrThrow();

	const otherLikes = await db.selectFrom('like')
		.where('family_id', "=", user.family_id)
		.select(['recipe_id', 'user_id'])
		.execute();

	res.json(otherLikes);
}