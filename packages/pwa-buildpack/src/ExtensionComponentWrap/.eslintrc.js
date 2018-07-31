module.exports = {
    parserOptions: {
        sourceType: 'module'
    },
    rules: {
        // All other code in this project is expected to run in Node.
        // This comes from the extended "node:recommended" configuration.
        // ESLint does not allow overrides to remove "extends", so
        // we instead disable this individual rule for this file.
        // Remove when moving ExtensionComponentWrap to Peregrine.
        'node/no-unsupported-features': 'off',
        'node/no-unsupported-features/es-syntax': 'off'
    }
};
