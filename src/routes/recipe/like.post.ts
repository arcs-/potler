import { db } from '@src/services/database';
import { z, object } from 'zod';

export const likeSchema = object({
	ids: z.number().array(),
});

export async function like(req: ApiRequest<typeof likeSchema>, res: ApiResponse) {

	const user = await db.selectFrom('user')
		.where('id', "=", req.auth!.id)
		.select(['family_id'])
		.executeTakeFirstOrThrow();

	await db.insertInto('like')
		.values(req.body.ids.map((id) => ({
			recipe_id: id,
			user_id: req.auth!.id,
			family_id: user.family_id ?? 0
		})))
		.execute();

	await db.updateTable('recipe')
		.where('id', 'in', req.body.ids)
		.set(eb => ({
			likes: eb('likes', '+', 1)
		}))
		.execute();

	res.json({
		state: 'success'
	});
}