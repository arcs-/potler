import { db } from '@src/services/database';

export async function me(req: ApiRequest, res: ApiResponse) {

	const user = await db.selectFrom('user')
		.where('id', "=", req.auth!.id)
		.selectAll()
		.executeTakeFirstOrThrow();
	user.login_hash = null;

	const family = await db.selectFrom('user')
		.where('family_id', "=", user.family_id)
		.select(['id', 'email', 'first_name', 'last_name'])
		.execute();

	res.json({
		user,
		family
	});
}