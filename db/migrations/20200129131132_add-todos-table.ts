import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('todos').createTable('todos', table => {
    table.bigIncrements('id').primary();
    table.text('message');
    table.timestamps(false, true);
    table
      .bigInteger('user_id')
      .defaultTo(knex.raw('todos_public.get_user_id()'))
      .references('id')
      .inTable('todos.user')
      .onDelete('cascade');
  });
  // return knex.raw(onUpdateTrigger('todos.todos'));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('todos').dropTable('todos');
}
