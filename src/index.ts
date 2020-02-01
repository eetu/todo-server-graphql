import * as express from 'express';
import postgraphile from 'postgraphile';

require('dotenv').config();

const app = express();

app.use(
  postgraphile(process.env.DATABASE_URL, 'public', {
    enableCors: process.env.NODE_ENV !== 'prod',
    watchPg: true,
    graphiql: process.env.NODE_ENV !== 'prod',
    enhanceGraphiql: true,
    // jwtSecret: process.env.JWT_SECRET,
    // jwtPgTypeIdentifier: 'public.jwt_token',
    showErrorStack: true,
    // pgDefaultRole: 'user_guest',
    ignoreRBAC: false,
  }),
);

app.listen(process.env.PORT);

process.stdout.write(`Server listening on port ${process.env.PORT}\n`);
