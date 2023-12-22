import type { Insertable } from 'kysely'
import type { User } from '@src/@types/kysely';
import { db } from '@src/services/database';
import { z, object } from 'zod';
import argon2 from '@node-rs/argon2'
import { generateToken } from '@src/services/auth';

export const registerSchema = object({
  email: z.string(),
  first_name: z.string(),
  password: z.string().optional(),
});

export async function register(
  req: ApiRequest<typeof registerSchema>,
  res: ApiResponse,
) {

  const newUser: Insertable<User> = {
    email: req.body.email,
    first_name: req.body.first_name,
  };

  if (req.body.password) {
    newUser.login_hash = await argon2.hash(req.body.password);
  }

  const inserted = await db.insertInto('user')
    .values(newUser)
    .returningAll()
    .executeTakeFirstOrThrow();
  inserted.login_hash = null;

  const token = generateToken(inserted);

  res.json({
    user: inserted,
    token,
  });
}