const { URL } = require('url');
const fetch = require('fetch');

module.exports = async magentoHost => {
    let uri;

    try {
        uri = new URL('webpack-config.json', magentoHost);
    } catch (e) {
        throw Error('get-magento-env: Invalid Magento domain specified.');
    }

    return fetch(uri.href).then(res => res.json());
};
