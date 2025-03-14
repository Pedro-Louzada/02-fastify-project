import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'
/* 
  I individualized the json config for can export only configurations to knexfile.ts, 
  and not the database connection.
*/
export const config: Knex.Config = {
  // type database
  client: 'sqlite',
  // connection config
  connection: {
    // database file path
    // process é uma variável global do Node
    filename: env.DATABASE_URL,
  },
  // set null to default field of db
  useNullAsDefault: true,
  // migrations config
  migrations: {
    extension: 'ts',
    // path of migration file
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
