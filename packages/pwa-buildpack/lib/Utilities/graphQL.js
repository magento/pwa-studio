const fetch = require('node-fetch');
const graphQLQueries = require('../queries');
const { Agent: HTTPSAgent } = require('https');

// To be used with `node-fetch` in order to allow self-signed certificates.
const fetchAgent = new HTTPSAgent({ rejectUnauthorized: false });

const fetchQuery = query => {
    return fetch(
        new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString(),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
            },
            body: query,
            agent: fetchAgent
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
    const query = graphQLQueries.getMediaUrl;
    return fetchQuery(JSON.stringify({ query })).then(
        data => data.storeConfig.secure_base_media_url
    );
};

/**
 * Get the schema's types.
 */
const getSchemaTypes = () => {
    const query = graphQLQueries.getSchemaTypes;
    return fetchQuery(JSON.stringify({ query }));
};

/**
 * Get translations
 */
const getTranslations = (local, phrases) => {
    const variables = { locale: local, phrases: phrases };
    const query = graphQLQueries.getTranslations;
    return fetchQuery(JSON.stringify({ query, variables })).then(
        data => data.translate.items
    );
};

/**
 * Get Available Locales
 */
const getAvailableLocales = () => {
    const query = graphQLQueries.getAvailableLocales;
    return fetchQuery(JSON.stringify({ query })).then(
        data => data.availableLocales.items
    );
};

/**
 * Get Available Store Views
 */
const getAvailableStoreViews = () => {
    console.log('Fetching available store views');
    const query = graphQLQueries.getAvailableStoreViews;
    return fetchQuery(JSON.stringify({ query })).then(
        data => data.availableStoreViews.items
    );
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
    getTranslations,
    getAvailableLocales,
    getUnionAndInterfaceTypes,
    getAvailableStoreViews
};
