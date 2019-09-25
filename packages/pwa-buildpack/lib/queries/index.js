// Execute this first so we can import .graphql files directly.
const requireGraphQL = require('require-graphql-file');

// Import all the build-time queries.
const getMediaUrl = requireGraphQL('../queries/getStoreMediaUrl');
const getSchemaTypes = requireGraphQL('../queries/getSchemaTypes');

// Export the queries for use by the rest of buildpack.
module.exports = {
    getMediaUrl,
    getSchemaTypes
};
