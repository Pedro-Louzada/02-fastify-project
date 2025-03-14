import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    // primary key
    table.uuid('id').primary()
    // notNullable significa que não pode ser nulo
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    // defaultTo da um valor default ao campo
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  // dropTable => defaz a tabela
  await knex.schema.dropTable('transactions')
}
