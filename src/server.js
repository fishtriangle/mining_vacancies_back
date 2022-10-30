import { ApolloServer } from 'apollo-server';
import schema from './schema.js';
import context from './context.js';

const { typeDefs, resolvers } = schema;
const server = new ApolloServer({ typeDefs, resolvers, context });

export const outputServer = () => {
  server.listen().then(({ url }) => console.log(`Server listen at: ${url}`));
};
