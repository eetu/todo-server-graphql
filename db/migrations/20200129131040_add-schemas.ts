import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createSchema('todos');
  await knex.schema.createSchema('todos_private');
  return knex.schema.createSchema('todos_public');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropSchema('todos_public');
  await knex.schema.dropSchema('todos_private');
  await knex.schema.dropSchema('todos');
}
