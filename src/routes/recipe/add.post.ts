import type { Ingredient, Recipe } from 'kysely-codegen';
import type { Insertable } from 'kysely';
import { db } from '@src/services/database';
import { z, object } from 'zod';

export const addSchema = object({
    name: z.string().max(255).min(5),
    description: z.string().max(1024).optional(),
    instructions: z.string().max(1024).optional(),
    source: z.string().max(1024).optional(),
    ingredients: z.array(z.object({
        name: z.string().max(255).min(2),
        amount: z.string(),
        unit: z.string().max(255).min(1).optional(),
        optional: z.boolean().optional(),
        order: z.number().optional(),
    })).min(1),
});

export async function add(
    req: ApiRequest<typeof addSchema>,
    res: ApiResponse,
) {

    const recipeToInsert: Insertable<Recipe> = {
        name: req.body.name,
        description: req.body.description,
        instructions: req.body.instructions,
        source: req.body.source,
        author_id: req.auth!.id,
    };

    const recipe = await db.insertInto('recipe')
        .values(recipeToInsert)
        .returningAll()
        .executeTakeFirstOrThrow();

    const ingredientsToInsert: Array<Insertable<Ingredient>> = req.body.ingredients.map((ingredient) => ({
        recipe_id: recipe.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        order: ingredient.order,
    }));

    const ingredients = await db.insertInto('ingredient')
        .values(ingredientsToInsert)
        .returningAll()
        .executeTakeFirstOrThrow();

    res.json({
        state: 'success',
        recipe: {
            ...recipe,
            ingredients,
        }
    });
}