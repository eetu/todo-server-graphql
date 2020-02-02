import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    -- Enable crypto for making hash password
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);

  // Public information of user
  await knex.schema.withSchema('todos').createTable('user', table => {
    table.bigIncrements('id').primary();
  });

  // Private information of user, passwd etc.
  return knex.schema.withSchema('todos_private').createTable('user_account', table => {
    table
      .bigInteger('user_id')
      .primary()
      .references('id')
      .inTable('todos.user')
      .onDelete('cascade');
    table
      .string('username', 255)
      .notNullable()
      .unique();
    table.text('password_hash').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('todos_private').dropTable('user_account');
  return knex.schema.withSchema('todos').dropTable('user');
}
