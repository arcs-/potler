import type { Response } from 'express';
import type { User } from 'kysely-codegen';
import type { Insertable } from 'kysely';
import type { TypedRequestBody } from 'zod-express-middleware';
import { db } from '@src/services/database';
import { z, object } from 'zod';
import argon2 from '@node-rs/argon2'

export const registerSchema = object({
  first_name: z.string(),
  email: z.string(),
  password: z.string().optional(),
});

export async function register(
  req: TypedRequestBody<typeof registerSchema>,
  res: Response,
) {

  let login_hash = null
  if (req.body.password) {
    login_hash = await argon2.hash(req.body.password);
  }

  const inserted = await db.insertInto('user')
    .values({
      first_name: req.body.first_name,
      email: req.body.email,
      login_hash: login_hash,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  inserted.login_hash = null;
  res.json({
    state: 'success',
    user: inserted,
  });
}