const optionsValidator = require('../util/options-validator');
const validateConfig = optionsValidator('MagentoResolver', {
    'paths.root': 'string'
});
module.exports = {
    validateConfig,
    async configure(options) {
        validateConfig('.configure()', options);
        return {
            alias: {},
            modules: [options.paths.root, 'node_modules'],
            mainFiles: ['index'],
            mainFields: ['esnext', 'es2015', 'module', 'browser', 'main'],
            extensions: ['.wasm', '.mjs', '.js', '.json', '.graphql']
        };
    }
};
