const optionsValidator = require('../util/options-validator');
const validateConfig = optionsValidator('MagentoResolver', {
    'paths.root': 'string'
});
module.exports = {
    validateConfig,
    async configure(options) {
        const { isEE, ...restOptions } = options;
        const extensions = [
            '.wasm',
            '.mjs',
            isEE ? '.ee.js' : '.ce.js',
            '.js',
            '.jsx',
            '.json',
            '.graphql'
        ];
        validateConfig('.configure()', restOptions);
        return {
            alias: {},
            modules: [options.paths.root, 'node_modules'],
            mainFiles: ['index'],
            mainFields: ['esnext', 'es2015', 'module', 'browser', 'main'],
            extensions
        };
    }
};
