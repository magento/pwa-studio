const { ApolloServer, gql } = require('apollo-server');
module.exports = async function(schema, Query) {
    const typeDefs = gql(schema);
    const server = new ApolloServer({
        typeDefs,
        resolvers: { Query }
    });
    const { url } = server.listen();
    return {
        url,
        server,
        async close() {
            return new Promise(resolve => {
                server.on('close', resolve);
                server.close();
            });
        }
    };
};
