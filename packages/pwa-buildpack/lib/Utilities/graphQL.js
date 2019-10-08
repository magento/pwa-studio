const fetch = require('node-fetch');
const graphQLQueries = require('../queries');

const fetchQuery = query => {
    return fetch(
        new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString(),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
            },
            body: JSON.stringify({ query })
        }
    )
        .then(result => result.json())
        .then(json => json.data)
        .catch(err => {
            console.error(err);
            throw err;
        });
};

/**
 * An Async function that will asynchronously fetch the
 * media backend Url from magento graphql server.
 *
 * @returns Promise that will resolve to the media backend url.
 */
const getMediaURL = () => {
    return fetchQuery(graphQLQueries.getMediaUrl).then(
        data => data.storeConfig.secure_base_media_url
    );
};

/**
 * Get the schema's types.
 */
const getSchemaTypes = () => {
    return fetchQuery(graphQLQueries.getSchemaTypes);
};

/**
 * Get only the Union and Interface types in the schema.
 */
const getUnionAndInterfaceTypes = () => {
    return getSchemaTypes().then(data => {
        // Filter out any type information unrelated to unions or interfaces.
        const relevantData = data.__schema.types.filter(type => {
            return type.possibleTypes !== null;
        });

        data.__schema.types = relevantData;

        return data;
    });
};

module.exports = {
    getMediaURL,
    getSchemaTypes,
    getUnionAndInterfaceTypes
};
