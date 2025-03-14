import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    /*
         - método after coloca a coluna depois de outra específica;
         - método index é utilizado em colunas onde o índice de busca é grande
         facilitando a mesma;
        */
    table.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    /*
             - método dropColumn exclui a coluna;
            */
    table.dropColumn('session_id')
  })
}
