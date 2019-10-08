const fs = require('fs');
const path = require('path');

/**
 * Normal `require` doesn't know what to do with .graphql files, so this helper function
 * simply imports their contents as a string.
 * @see https://github.com/apollographql/apollo-server/issues/1175#issuecomment-397257339.
 *
 * @param   {String} filepath - A relative path to a .graphql file to read.
 * @returns {String} - The contents of the file as a string.
 */
const requireGraphQL = filePath => {
    const absolutePath = path.resolve(__dirname, filePath);
    return fs.readFileSync(absolutePath, { encoding: 'utf8' });
};

// Import all the build-time queries.
const getMediaUrl = requireGraphQL('../queries/getStoreMediaUrl.graphql');
const getSchemaTypes = requireGraphQL('../queries/getSchemaTypes.graphql');

// Export the queries for use by the rest of buildpack.
module.exports = {
    getMediaUrl,
    getSchemaTypes
};
