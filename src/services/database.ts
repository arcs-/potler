import { DB } from 'kysely-codegen';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import env from '@src/env';

const database = new Database(env.DATABASE_URL + '');
database.pragma('journal_mode = WAL');

const dialect = new SqliteDialect({
  database, 
});

export const db = new Kysely<DB>({
  dialect,
  log: ['query'],
});
