/**
 * Replicates the Jest configuration which mocks all CSS modules. Since most
 * testing scenarios don't render or paint the components, loading real CSS
 * wastes resources.
 *
 * Use for CSS modules when testing React components built by Webpack,
 * specifically in a target-testing scenario.
 */

function identityObjProxyLoader() {
    return 'exports = module.exports = require("identity-obj-proxy");';
}

module.exports = identityObjProxyLoader;
