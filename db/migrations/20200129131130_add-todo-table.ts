import * as Knex from 'knex';

import { onUpdateTrigger } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todos', table => {
    table.bigIncrements('id').primary();
    table.text('message');
    table.timestamps(false, true);
  });
  return knex.raw(onUpdateTrigger('todos'));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('dots');
}
