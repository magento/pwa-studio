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

/**
 * Webpack plugin that makes GraphQL call to get the Media
 * Backend URL which is needed by WebpackHTMLPlugin to be
 * replace in template.html. This is done by fetching the URL
 * from GraphQL and placing it in global.MAGENTO_MEDIA_BACKEND_URL
 * for the WebpackHTMLPlugin to pickup.
 */
class MediaBackendURLFetcherPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapPromise(
            'MediaBackendURLFetcherPlugin',
            () =>
                new Promise(resolve => {
                    getMediaURL().then(url => {
                        global.MAGENTO_MEDIA_BACKEND_URL = url;
                        resolve();
                    });
                })
        );
    }
}

module.exports = MediaBackendURLFetcherPlugin;
