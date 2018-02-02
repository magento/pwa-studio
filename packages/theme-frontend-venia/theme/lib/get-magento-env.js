const { URL } = require('url');
const makeFetchHappen = require('make-fetch-happen');

// `strictSSL` corresponds to `rejectUnauthorized`
// our self-signed certs are "unauthorized", and we want to accept them
const fetch = makeFetchHappen.defaults({
    cache: 'no-store',
    strictSSL: false
});

module.exports = async magentoHost => {
    let uri;

    try {
        uri = new URL('webpack-config.json', magentoHost);
    } catch (e) {
        throw Error('get-magento-env: Invalid Magento domain specified.');
    }

    return fetch(uri.href).then(res => res.json());
};
