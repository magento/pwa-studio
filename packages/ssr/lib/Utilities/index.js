const { createDOM } = require('./dom');
const { addHttp2PushLinkHeader } = require('./http2Push');
const ApolloExtractor = require('./ApolloExtractor');
const InMemoryCache = require('./InMemoryCache');

module.exports = {
    createDOM,
    addHttp2PushLinkHeader,
    ApolloExtractor,
    InMemoryCache
};
