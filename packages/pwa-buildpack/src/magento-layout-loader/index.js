const dynamicImportSyntax = require('@babel/plugin-syntax-dynamic-import');
const babelLoader = require('babel-loader');
const babelPlugin = require('./babel-plugin-magento-layout');

/**
 * The Magento Layout Loader is a small wrapper around
 * babel-loader and a babel plugin.
 */
module.exports = function magentoLayoutLoader(...args) {
    // Don't bother supporting string-based queries until we need to
    const loaderConfig = this.query || {};

    const babelPluginConfig = Object.assign({}, loaderConfig, {
        onWarning: warning => {
            const err = new Error(`magento-layout-loader: ${warning}`);
            this._module.warnings.push(err);
        },
        onError: error => {
            const err = new Error(`magento-layout-loader: ${error}`);
            this._module.errors.push(err);
        }
    });

    // Options we want to pass through to the babel-loader
    // we are wrapping
    const query = {
        babelrc: false,
        plugins: [dynamicImportSyntax, [babelPlugin, babelPluginConfig]]
    };

    // Yuck. babel-loader reads options from the webpack loader's
    // `this.query` property (through loader-utils). We need to set this property
    // to pass through options, but webpack has a `getter` without a `setter`
    // so we can't just mutate `this.query`. Instead of the mutation,
    // we create a new object with the proto pointed at the current `this`,
    // and just shadow the `query` prop
    const shadowThis = Object.create(this, {
        query: { value: query }
    });

    return babelLoader.apply(shadowThis, args);
};
