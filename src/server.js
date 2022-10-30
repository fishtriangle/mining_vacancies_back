import { ApolloServer } from '@apollo/server';
import schema from './schema.js';
import { startStandaloneServer } from '@apollo/server/standalone';
import context from './context.js';
import process from 'node:process';

const { typeDefs, resolvers } = schema;
// const server = new ApolloServer({ typeDefs, resolvers, context });

// export const outputServer = () => {
//   server.listen().then(({ url }) => console.log(`Server listen at: ${url}`));
// };

const outputServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: () => context,
    listen: { port: process.env.PORT },
  });
  console.log(`🚀  Server ready at ${url}`);
};

export default outputServer;
