import Database from 'better-sqlite3'
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely'
import type { DB } from '~/types/kysely'

const runtimeConfig = useRuntimeConfig()

const database = new Database(runtimeConfig.databaseUrl)
database.pragma('journal_mode = WAL')

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({ database }),
  plugins: [new ParseJSONResultsPlugin()],
  log: ['query'],
})
