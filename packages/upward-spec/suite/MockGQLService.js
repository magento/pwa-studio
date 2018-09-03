const { ApolloServer, gql } = require('apollo-server');
module.exports = function(schema, Query) {
    const typeDefs = gql(schema);
    const server = new ApolloServer({
        typeDefs,
        resolvers: { Query }
    });
    return server.listen();
};
