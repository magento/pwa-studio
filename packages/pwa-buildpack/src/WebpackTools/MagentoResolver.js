const optionsValidator = require('../util/options-validator');
const validateConfig = optionsValidator('MagentoResolver', {
    'paths.root': 'string'
});
module.exports = {
    validateConfig,
    async configure(options) {
        validateConfig('.configure()', options);
        return {
            modules: [options.paths.root, 'node_modules'],
            mainFiles: ['index'],
            extensions: ['.mjs', '.js', '.json', '.graphql']
        };
    }
};
