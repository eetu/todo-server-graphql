import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as pg from 'pg';
import { makeSchemaAndPlugin } from 'postgraphile-apollo-server';

const postGraphileOptions = {
  enableCors: process.env.NODE_ENV !== 'prod',
  // watchPg: true,
  graphiql: process.env.NODE_ENV !== 'prod',
  enhanceGraphiql: true,
  jwtSecret: process.env.JWT_SECRET,
  jwtPgTypeIdentifier: 'todos_public.jwt_token',
  showErrorStack: true,
  // pgDefaultRole: 'user_guest',
  ignoreRBAC: false,
};

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main(): Promise<void> {
  // See https://www.graphile.org/postgraphile/usage-schema/ for schema-only usage guidance
  const { schema, plugin } = await makeSchemaAndPlugin(pgPool, 'todos', postGraphileOptions);

  // See https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#ApolloServer
  const server = new ApolloServer({
    schema,
    plugins: [plugin],
  });

  const app = express();
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`),
  );
}

main();
