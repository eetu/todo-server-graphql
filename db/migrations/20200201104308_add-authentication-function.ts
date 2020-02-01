import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create function public.authenticate(
      username text,
      password text
    ) returns public.jwt_token as $$
    declare
      account private.user_account;
    begin
      select a.* into account
        from private.user_account as a
        where a.username = authenticate.username;
      if account.password_hash = crypt(password, account.password_hash) then
        return (
          'user_role',
          extract(epoch from now() + interval '7 days'),
          account.user_id,
          account.is_admin,
          account.username
        )::public.jwt_token;
      else
        return null;
      end if;
    end;
    $$ language plpgsql strict security definer;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP FUNCTION public.authenticate`);
}
