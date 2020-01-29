import * as express from 'express';
import postgraphile from 'postgraphile';

require('dotenv').config();

const app = express();

app.use(
  postgraphile(process.env.DATABASE_URL, 'public', {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
  }),
);

app.listen(process.env.PORT);

process.stdout.write(`Server listening on port ${process.env.PORT}\n`);
