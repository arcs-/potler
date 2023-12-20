import type { Response } from 'express';
import type { User } from 'kysely-codegen';
import type { Insertable } from 'kysely';
import type { TypedRequestBody } from 'zod-express-middleware';
import { db } from '@src/services/database';
import { z, object } from 'zod';

export const registerSchema = object({
  user: object({
    first_name: z.string(),
    email: z.string(),
    password: z.string().optional(),
  }),
});

export async function register(
  req: TypedRequestBody<typeof registerSchema>, 
  res: Response,
) {
  const user: Insertable<User> = req.body.user;

  if(req.body.user.password) {
    user.login_hash = '!!!'+req.body.user.password;
  }

  const inserted = await db.insertInto('user')
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();

  res.json({
    state: 'success',
    user: inserted,
  });
}