import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TYPE public.jwt_token AS (
      role text,
      exp integer,
      user_id integer,
      is_admin boolean,
      username varchar
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP TYPE public.jwt_token`);
}
