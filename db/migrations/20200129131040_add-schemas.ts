import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createSchema('private');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('private');
}
