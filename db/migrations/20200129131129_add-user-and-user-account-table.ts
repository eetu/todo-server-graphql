import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    -- Enable crypto for making hash password
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);

  // Public information of user
  await knex.schema.createTable('user', table => {
    table.bigIncrements('id').primary();
  });

  // Private information of user, passwd etc.
  return knex.schema.withSchema('private').createTable('user_account', table => {
    table
      .bigInteger('user_id')
      .primary()
      .references('user.id')
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
  await knex.schema.withSchema('private').dropTable('user_account');
  return knex.schema.dropTable('user');
}
