const fetch = require('node-fetch');

const fetchQuery = query =>
    fetch(new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query
        })
    })
        .then(result => result.json())
        .catch(err => {
            console.error(err);
            return '';
        });

/**
 * An Async function that will asynchronously fetch the
 * media backend Url from magento graphql server. Also
 * will set the MAGENTO_MEDIA_BACKEND_URL value on global
 * object to the resulting url.
 *
 * @returns Promise that will resolve to the media backend url.
 */
const getMediaURL = () =>
    new Promise(resolve => {
        fetchQuery('query { storeConfig { secure_base_media_url } }')
            .then(json => json.data.storeConfig.secure_base_media_url)
            .then(url => {
                global.MAGENTO_MEDIA_BACKEND_URL = url;
                resolve(url);
            })
            .catch(err => {
                console.error('Unable to fetch Media URL', err);
                resolve('');
            });
    });

/**
 * An Async function that will asynchronously fetch the
 * store name from magento graphql server. Also will set the
 * STORE_NAME value on the global object to the resulting name.
 *
 * @returns Promise that will resolve to the store name.
 */
const getStoreName = () =>
    new Promise(resolve => {
        /**
         * TODO
         * There is no way as of now to get the store name from storeConfig.
         * storeConfig.default_title is just a filler.
         */
        fetchQuery('query { storeConfig { default_title } }')
            .then(json => json.data.storeConfig.default_title)
            .then(storeName => {
                global.STORE_NAME = storeName;
                resolve(storeName);
            });
    });

module.exports = { getMediaURL, getStoreName };
