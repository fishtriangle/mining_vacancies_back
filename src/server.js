import { ApolloServer } from '@apollo/server';
import schema from './schema.js';
import context from './context.js';
import process from 'node:process';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

const { typeDefs, resolvers } = schema;

// const outputServer = async () => {
//   const server = new ApolloServer({ typeDefs, resolvers });
//   const { url } = await startStandaloneServer(server, {
//     context: () => context,
//     listen: { port: process.env.PORT || 4000 },
//   });
//   console.log(`🚀  Server ready at ${url}`);
// };

const outputServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    '/',
    cors(),
    bodyParser.json({ limit: '50mb' }),
    expressMiddleware(server, {
      context: () => context,
    })
  );
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
  );
  console.log(`Server ready on port ${process.env.PORT || 4000}`);
};

export default outputServer;
