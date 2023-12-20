import type { Response } from 'express';
import type { Recipe, User } from 'kysely-codegen';
import type { Insertable } from 'kysely';
import type { TypedRequestBody } from 'zod-express-middleware';
import { db } from '@src/services/database';
import { z, object } from 'zod';

export const addSchema = object({
    name: z.string(),
    description: z.string().optional(),
    instructions: z.string().optional(),
    source: z.string().optional()
});

export async function add(
    req: TypedRequestBody<typeof addSchema>,
    res: Response,
) {

    const recipe: Insertable<Recipe> = {
        ...req.body,
        author_id: 1,
    };

    const inserted = await db.insertInto('recipe')
        .values(recipe)
        .returningAll()
        .executeTakeFirstOrThrow();

    res.json({
        state: 'success',
        recipe: inserted,
    });
}