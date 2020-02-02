import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE ROLE user_admin;
    GRANT user_admin to postgres;

    CREATE ROLE user_login;
    GRANT user_login to postgres, user_admin;

    CREATE ROLE user_guest;
    GRANT user_guest to postgres, user_login;

    ALTER TABLE todos.user enable row level security;
    ALTER TABLE todos_private.user_account enable row level security;
    ALTER TABLE todos.todos enable row level security;

    GRANT USAGE ON SCHEMA todos to user_login;
    GRANT USAGE ON SCHEMA todos_private to user_admin;
    GRANT USAGE ON SCHEMA todos_public to user_guest;

    GRANT SELECT ON TABLE todos.user TO user_login;
    GRANT SELECT, DELETE, INSERT(message), UPDATE(message) ON TABLE todos.todos TO user_login;
    GRANT ALL ON TABLE todos.user TO user_admin;
    GRANT ALL ON TABLE todos_private.user_account TO user_admin;
    GRANT EXECUTE ON FUNCTION todos_public.register(text, text) to user_guest; -- For function this is sufficient and no need for policy

    CREATE POLICY select_user ON todos.user FOR SELECT TO user_login USING (id = todos_public.get_user_id());
    CREATE POLICY update_user ON todos.user FOR UPDATE TO user_login USING (id = todos_public.get_user_id());
    CREATE POLICY select_todos ON todos.todos for SELECT TO user_login USING (true); -- Give access to all users to read all todos
    CREATE POLICY insert_todos ON todos.todos for INSERT TO user_login WITH CHECK (user_id = todos_public.get_user_id()); -- Give access to every user to insert todos for themselves
    CREATE POLICY update_todos ON todos.todos FOR UPDATE TO user_login USING (user_id = todos_public.get_user_id());
    CREATE POLICY delete_todos ON todos.todos FOR DELETE TO user_login USING (user_id = todos_public.get_user_id());
    CREATE POLICY select_all_user ON todos.user for ALL TO user_admin USING (true); -- Give access to all user data to admin
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP POLICY select_user ON todos.user;
    DROP POLICY update_user ON todos.user;
    DROP POLICY select_todos ON todos.todos;
    DROP POLICY insert_todos ON todos.todos;
    DROP POLICY update_todos ON todos.todos;
    DROP POLICY delete_todos ON todos.todos;
    DROP POLICY select_all_user ON todos.user;

    REVOKE EXECUTE ON FUNCTION todos_public.register(text, text) FROM user_guest;
    REVOKE ALL ON TABLE todos_private.user_account FROM user_admin;
    REVOKE ALL ON TABLE todos.user FROM user_admin;
    REVOKE SELECT, DELETE, INSERT(message), UPDATE(message) ON TABLE todos.todos FROM user_login;
    REVOKE SELECT ON TABLE todos.user FROM user_login;

    REVOKE USAGE ON SCHEMA todos_public FROM user_guest;
    REVOKE USAGE ON SCHEMA todos_private FROM user_admin;
    REVOKE USAGE ON SCHEMA todos FROM user_login;

    REVOKE user_guest FROM postgres, user_login;
    DROP ROLE user_guest;
    REVOKE user_login FROM postgres, user_admin;
    DROP ROLE user_login;
    REVOKE user_admin FROM postgres;
    DROP ROLE user_admin;
  `);
}
