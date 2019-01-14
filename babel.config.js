const browsers = require("./browserslist")

const plugins = [
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/plugin-syntax-jsx'],
    ['@babel/plugin-transform-react-jsx'],
    ['babel-plugin-graphql-tag']
];

const targets = {
    dev: 'last 2 Chrome versions',
    prod: browsers,
    test: 'node 10'
};

const config = {
    env: {
        development: {
            plugins,
            presets: [
                ['@babel/preset-env', { modules: false, targets: targets.dev }]
            ]
        },
        production: {
            plugins: [
                ...plugins,
                [
                    '@babel/plugin-transform-runtime',
                    { helpers: true, regenerator: false }
                ]
            ],
            presets: [
                ['@babel/preset-env', { modules: false, targets: targets.prod }]
            ]
        },
        test: {
            plugins,
            presets: [
                [
                    '@babel/preset-env',
                    { modules: 'commonjs', targets: targets.test }
                ]
            ]
        }
    }
};

module.exports = config;
