import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';

import schema from './schemas/schema.js';
import rootValue from './graphql/root.js';

const app = express();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue,
  })
);

app.listen(process.env.PORT, () => console.log('Server started on port 5000'));
