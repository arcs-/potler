import type { Ingredient, Recipe } from '@src/@types/kysely';
import type { Insertable, Updateable } from 'kysely';
import { db } from '@src/services/database';
import { z, object } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const updateSchema = object({
	id: z.number(),
	name: z.string().max(255).min(5),
	description: z.string().max(1024).optional(),
	instructions: z.string().max(1024).optional(),
	source: z.string().max(1024).optional(),
	cover: z.string().max(1024).optional(),
	ingredients: z.array(z.object({
		name: z.string().max(255).min(2),
		amount: z.string(),
		unit: z.string().max(255).min(1).optional(),
		optional: z.boolean().optional(),
		order: z.number().optional(),
	})).min(1),
});

export async function update(
	req: ApiRequest<typeof updateSchema>,
	res: ApiResponse,
) {

	const recipeCheck = await db.selectFrom('recipe')
		.where('recipe.id', "=", req.body.id)
		.select('author_id')
		.executeTakeFirstOrThrow();

	if (recipeCheck.author_id !== req.auth!.id && !req.auth!.admin) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({
				state: 'error',
				message: 'You are not allowed to delete this recipe.'
			});
	}

	const recipeToInsert: Updateable<Recipe> = {
		name: req.body.name,
		description: req.body.description,
		instructions: req.body.instructions,
		source: req.body.source,
		cover: req.body.cover,
	};

	const recipe = await db.updateTable('recipe')
		.set(recipeToInsert)
		.where('recipe.id', '=', req.body.id)
		.returningAll()
		.executeTakeFirst();

	await db.deleteFrom('ingredient')
		.where("recipe_id", "=", req.body.id)
		.execute();

	const ingredientsToInsert: Array<Insertable<Ingredient>> = req.body.ingredients.map((ingredient) => ({
		recipe_id: req.body.id,
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
		...recipe,
		ingredients,
	});
}