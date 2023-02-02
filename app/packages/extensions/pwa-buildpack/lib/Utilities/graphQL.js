const debug = require('../util/debug').makeFileLogger(__filename);

const fetch = require('node-fetch');
const graphQLQueries = require('../queries');
const https = require('https');

// To be used with `node-fetch` in order to allow self-signed certificates.
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const fetchQuery = query => {
    const targetURL = new URL('graphql', process.env.MAGENTO_BACKEND_URL);
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        Accept: 'application/json',
        'User-Agent': 'pwa-buildpack',
        Host: targetURL.host
    };

    if (process.env.STORE_VIEW_CODE) {
        headers['store'] = process.env.STORE_VIEW_CODE;
    }

    debug('Fetching query: %s', query);

    return fetch(targetURL.toString(), {
        agent: targetURL.protocol === 'https:' ? httpsAgent : null,
        body: JSON.stringify({ query }),
        headers: headers,
        method: 'POST'
    })
        .then(result => {
            debug('Result received');
            debug('Status: %s', result.status);

            return result.json();
        })
        .catch(err => {
            debug('Error received: %s', err);

            console.error(err);

            throw err;
        })
        .then(json => {
            if (json && json.errors && json.errors.length > 0) {
                console.warn(
                    '\x1b[36m%s\x1b[0m',
                    'As of version 12.1.0, PWA Studio requires the appropriate PWA metapackage to be installed on the backend.\n' +
                        'For more information, refer to the 12.1.0 release notes here: https://github.com/magento/pwa-studio/releases/tag/v12.1.0'
                );

                return Promise.reject(
                    new Error(
                        json.errors[0].message +
                            ` (... ${json.errors.length} errors total)`
                    )
                );
            }

            return json.data;
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
 * An Async function that will asynchronously fetch the
 * store config data from magento graphql server.
 *
 * @returns Promise that will resolve to the store config data.
 */
const getStoreConfigData = () => {
    return fetchQuery(graphQLQueries.getStoreConfigData).then(
        data => data.storeConfig
    );
};

/**
 * An async function that will fetch the availableStores
 *
 * @returns Promise
 */
const getAvailableStoresConfigData = () => {
    return fetchQuery(graphQLQueries.getAvailableStoresConfigData);
};

/**
 * Get the schema's types.
 */
const getSchemaTypes = () => {
    return fetchQuery(graphQLQueries.getSchemaTypes);
};

/**
 * @deprecated use {@link getPossibleTypes} with ApolloClient v3.
 *
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

/**
 * Generate, from schema, the possible types.
 *
 * https://www.apollographql.com/docs/react/data/fragments/#generating-possibletypes-automatically
 * @returns {Object}  This object maps the name of an interface or union type (the supertype) to the types that implement or belong to it (the subtypes).
 */
const getPossibleTypes = async () => {
    const data = await getSchemaTypes();

    const possibleTypes = {};

    data.__schema.types.forEach(supertype => {
        if (supertype.possibleTypes) {
            possibleTypes[supertype.name] = supertype.possibleTypes.map(
                subtype => subtype.name
            );
        }
    });

    return possibleTypes;
};

module.exports = {
    getMediaURL,
    getStoreConfigData,
    getAvailableStoresConfigData,
    getPossibleTypes,
    getSchemaTypes,
    getUnionAndInterfaceTypes
};
