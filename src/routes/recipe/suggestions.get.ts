import type { Request, Response } from 'express';
import { db } from '@src/services/database';

export async function suggestions(req: Request, res: Response) {

  // select likes from other in group

  // add some more

  const users = await db.selectFrom('recipe')
    .limit(20)
    .selectAll()
    .execute();

  res.json(users);
}