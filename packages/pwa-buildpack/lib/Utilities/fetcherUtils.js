const fetch = require('node-fetch');

const fetchQuery = query =>
    fetch(new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip'
        },
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
 * media backend Url from magento graphql server.
 *
 * @returns Promise that will resolve to the media backend url.
 */
const getMediaURL = () =>
    fetchQuery('query { storeConfig { secure_base_media_url } }')
        .then(json => json.data.storeConfig.secure_base_media_url)
        .catch(err => {
            console.error('Unable to fetch Media URL', err);
            return '';
        });

module.exports = { getMediaURL };
