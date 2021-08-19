const debug = require('../util/debug').makeFileLogger(__filename);

const fetch = require('node-fetch');
const graphQLQueries = require('../queries');
const https = require('https');

// To be used with `node-fetch` in order to allow self-signed certificates.
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const fetchQuery = query => {
    const targetURL = new URL('graphql', 'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/');
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        'Accept': 'application/json',
        'User-Agent': 'pwa-buildpack',
        'Host': targetURL.host
    };
    console.log(`targetURL: ${targetURL}`)
    console.log(`headers: ${JSON.stringify(headers)}`)
    if (process.env.STORE_VIEW_CODE) {
        headers['store'] = process.env.STORE_VIEW_CODE;
    }

    debug(`Fetching ${query}`);

    return fetch(targetURL.toString(), {
            agent: targetURL.protocol === 'https:' ? httpsAgent : null,
            body: JSON.stringify({ query }),
            headers: headers,
            method: 'POST'
        })
        .then(result => {
            console.log(`Fetched ${query}`);
            console.log(`Status code: ${result.status}`);
            console.log(`keys: ${Object.keys(result)}`)
            console.log(`Statustext: ${result.statusText}`)
            result
                .clone()
                .json()
                .then(json => {
                    console.log(`JSON: ${JSON.stringify(json)}`);
                    debug(`Response json: ${JSON.stringify(json)}`);
                })
                .catch(err => {
                    console.log('Failed to parsejson response');
                    debug(`Failed to parse json response: ${e}`);
                    result
                        .clone()
                        .text()
                        .then(text => {
                            console.log(text);
                            debug(`Response: ${text}`);
                        })
                        .catch(err => {
                            console.log('Failed to parse text response');
                            debug(`Failed to parse text response: ${err}`);
                            console.log(result);

                            throw err;
                        });

                    throw err;
                });

            return result.json();
        })
        .catch(err => {
            console.error(err);
            debug(`Failed to fetch ${query}`);
            debug(`Error: ${err}`);

            throw err;
        })
        .then(json =>
            json && json.errors && json.errors.length > 0 ?
            Promise.reject(
                new Error(
                    json.errors[0].message +
                    ` (... ${json.errors.length} errors total)`
                )
            ) :
            json.data
        );
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
const getPossibleTypes = async() => {
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
