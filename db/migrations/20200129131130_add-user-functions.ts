import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE FUNCTION todos_public.get_user_id()
    RETURNS integer AS $$
      SELECT nullif(current_setting('jwt.claims.user_id', TRUE),'')::integer;
    $$ LANGUAGE sql STABLE;

    CREATE FUNCTION todos_public.register(
      username text,
      password text
    ) returns todos.user as $$
    declare
      new_user todos.user;
    begin
      -- first insert in user table
      insert into todos.user DEFAULT VALUES
        returning * into new_user;

      -- use the user id from above insert and insert a user's private information to user_account table
      insert into todos_private.user_account (user_id, username, password_hash) values
        (new_user.id, username, crypt(password, gen_salt('bf')));

        return new_user;
    end;
    $$ language plpgsql strict security definer;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP FUNCTION todos_public.get_user_id;
    DROP FUNCTION todos_public.register;
  `);
}
