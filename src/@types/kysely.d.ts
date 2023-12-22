import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Favorite {
  id: Generated<number>;
  recipe_id: number;
  user_id: number;
}

export interface Filter {
  id: Generated<number>;
  name: string;
}

export interface Ingredient {
  amount: string;
  id: Generated<number>;
  name: string;
  optional: Generated<number>;
  order: Generated<number>;
  recipe_id: number;
  unit: string | null;
}

export interface Like {
  created_at: Generated<string>;
  family_id: number | null;
  id: Generated<number>;
  recipe_id: number;
  user_id: number;
}

export interface Recipe {
  author_id: number;
  cover: string | null;
  created_at: Generated<string>;
  description: string | null;
  dislikes: Generated<number>;
  id: Generated<number>;
  instructions: string | null;
  likes: Generated<number>;
  name: string;
  source: string | null;
}

export interface RecipeTag {
  recipe_id: number;
  tag_id: number;
}

export interface Tag {
  filter_id: number;
  id: Generated<number>;
  name: string;
}

export interface User {
  created_at: Generated<string>;
  email: string;
  family_id: number | null;
  first_name: string;
  id: Generated<number>;
  last_name: string | null;
  login_hash: string | null;
}

export interface DB {
  favorite: Favorite;
  filter: Filter;
  ingredient: Ingredient;
  like: Like;
  recipe: Recipe;
  recipe_tag: RecipeTag;
  tag: Tag;
  user: User;
}
