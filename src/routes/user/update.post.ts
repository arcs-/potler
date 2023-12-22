import type { Insertable } from 'kysely'
import type { User } from '@src/@types/kysely';
import { db } from '@src/services/database';
import { z, object } from 'zod';
import argon2 from '@node-rs/argon2'

export const updateSchema = object({
	first_name: z.string(),
	last_name: z.string(),
	email: z.string(),
	password: z.string(),
	family_id: z.number().optional(),
});

export async function update(
	req: ApiRequest<typeof updateSchema>,
	res: ApiResponse,
) {

	const userUpdate: Insertable<User> = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		family_id: req.body.family_id,
	};

	if (req.body.password) {
		userUpdate.login_hash = await argon2.hash(req.body.password);
	}

	const inserted = await db.updateTable('user')
		.set(userUpdate)
		.where('id', '=', req.auth!.id)
		.returningAll()
		.executeTakeFirstOrThrow();
	inserted.login_hash = null;

	res.json({
		user: inserted,
	});
}