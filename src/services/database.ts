import type { DB } from '@src/@types/kysely';
import Database from 'better-sqlite3';
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely';
import env from '@src/services/env';

const database = new Database(env.DATABASE_URL + '');
database.pragma('journal_mode = WAL');

const dialect = new SqliteDialect({
  database,
});

export const db = new Kysely<DB>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
  log: ['query'],
});
