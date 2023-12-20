import type { Request, Response } from 'express';
import { db } from '@src/services/database';

export async function all(_: Request, res: Response) {
  const users = await db.selectFrom('user')
    .selectAll()
    .execute();
  res.json(users);
}