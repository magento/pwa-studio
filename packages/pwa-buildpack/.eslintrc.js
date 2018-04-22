const config = {
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'script'
    },
    extends: ['@magento', "plugin:node/recommended"],
    plugins: [
        "babel",
        "node"
    ]
};

module.exports = config;
