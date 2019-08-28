const fetch = require('node-fetch');

const getMediaURL = () =>
    fetch(new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: 'query { storeConfig { secure_base_media_url } }'
        })
    })
        .then(result => result.json())
        .then(json => json.data.storeConfig.secure_base_media_url)
        .catch(err => {
            console.error(err);
            return '';
        });

class MediaBackendURLFetcherPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapPromise('MediaBackendURLFetcherPlugin', () => {
            return new Promise(resolve => {
                getMediaURL().then(url => {
                    global.magentoMediaBackendURL = url;
                    resolve();
                });
            });
        });
    }
}

module.exports = MediaBackendURLFetcherPlugin;
