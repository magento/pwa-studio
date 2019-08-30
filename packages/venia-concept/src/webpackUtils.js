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

module.exports = { getMediaURL };
