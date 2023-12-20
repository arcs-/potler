import type { Response } from 'express';
import type { TypedRequestBody } from 'zod-express-middleware';
import type { Request } from "express-jwt";
import { z, object } from 'zod';
import { generateToken } from '@src/services/auth';
import { db } from '@src/services/database';
import argon2 from '@node-rs/argon2'

export const loginSchema = object({
  email: z.string(),
  password: z.string().optional(),
});

export async function login(
  req: TypedRequestBody<typeof loginSchema> & Request,
  res: Response,
) {

  const user = await db.selectFrom('user')
    .where('email', "=", req.body.email)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    res
      .status(401)
      .json({ state: 'error', message: 'User not found' })
    return;
  }

  if (!user.login_hash) {
    res
      .status(401)
      .json({ state: 'error', message: 'Passwordless is not supported' })
    return;
  }

  if (user.login_hash) {
    const hashVerified = await argon2.verify(user.login_hash, req.body.password);
    if (!hashVerified) {
      res
        .status(401)
        .json({ state: 'error', message: 'Invalid password' })
      return;
    }
  }

  const token = generateToken(user);

  user.login_hash = null;
  res.json({ state: 'success', token, user });
}