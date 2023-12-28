import { z, object } from 'zod';
import { generateToken } from '@src/services/auth';
import { db } from '@src/services/database';
import argon2 from '@node-rs/argon2'
import { StatusCodes } from 'http-status-codes';

export const loginSchema = object({
  email: z.string(),
  password: z.string(),
});

export async function login(
  req: ApiRequest<typeof loginSchema>,
  res: ApiResponse,
) {

  const user = await db.selectFrom('user')
    .where('email', "=", req.body.email)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ state: 'error', message: 'User not found' })
    return;
  }

  if (!user.login_hash) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ state: 'error', message: 'Passwordless is not supported' })
    return;
  }

  if (user.login_hash) {
    const hashVerified = await argon2.verify(user.login_hash, req.body.password);
    if (!hashVerified) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ state: 'error', message: 'Invalid password' })
      return;
    }
  }

  const token = generateToken(user);

  user.login_hash = null;
  res.json({ state: 'success', token, user });
}