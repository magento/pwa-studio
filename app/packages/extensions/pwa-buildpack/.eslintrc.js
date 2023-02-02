// eslint-disable-next-line node/no-unpublished-require
const rootPkg = require('../../package.json');
const rootModules = Object.keys(rootPkg.devDependencies).concat(
    rootPkg.dependencies ? Object.keys(rootPkg.dependencies) : []
);
const uniqueRootModules = [...new Set(rootModules)];

const config = {
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'script'
    },
    extends: ['@magento', 'plugin:node/recommended'],
    plugins: ['babel', 'node'],
    settings: {
        node: {
            allowModules: uniqueRootModules
        }
    },
    rules: {
        'no-prototype-builtins': 'off',
        'no-undef': 'off',
        'no-useless-escape': 'off'
    }
};

module.exports = config;
