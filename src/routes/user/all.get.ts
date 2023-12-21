import { db } from '@src/services/database';

export async function all(req: ApiRequest, res: ApiResponse) {
  if (req.auth!.admin) throw new Error('Not authorized');

  const users = await db.selectFrom('user')
    .selectAll()
    .execute();
  res.json(users);
}