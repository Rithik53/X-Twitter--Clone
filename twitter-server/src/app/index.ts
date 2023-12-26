import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import { prismaclient } from "../clients/db";


export async function initserver() {
    const app = express();
    app.use(bodyParser.json());

    prismaclient.user.create({
        data: {
            
        }
    })
    const graphqlServer = new ApolloServer({
        typeDefs:`
        type Query {
            sayHello: String
            sayHelloToMe(name: String!): String
        }
        `,
        resolvers: {
            Query: {
                sayHello: ()=> `Hello From graphql server`,
                sayHelloToMe: (parent: any, {name}:{name: String}) =>`hey ${name}`
            },
        },
    
    });

    await graphqlServer.start();
    app.use('/graphql', expressMiddleware(graphqlServer));

    return app;
}