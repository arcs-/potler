import type { Response } from 'express';
import type { Request } from "express-jwt";
import { db } from '@src/services/database';

export async function suggestions(req: Request, res: Response) {
	const users = await db.selectFrom('recipe')
		// .where('author_id', "=", req.auth)
		.limit(20)
		.selectAll()
		.execute();

	res.json(users);
}