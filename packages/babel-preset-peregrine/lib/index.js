const plugins = [
    /**
     * See:
     * https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
     * https://babeljs.io/docs/en/babel-plugin-proposal-object-rest-spread
     * https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
     * https://babeljs.io/docs/en/next/babel-plugin-syntax-jsx.html
     * https://babeljs.io/docs/en/babel-plugin-transform-react-jsx
     * https://www.npmjs.com/package/babel-plugin-graphql-tag
     */
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/plugin-syntax-jsx'],
    ['@babel/plugin-transform-react-jsx'],
    ['babel-plugin-graphql-tag']
];

const config = (api, opts = {}) => {
    // Different environments, different settings for preset-env.
    const targets = Object.assign(
        {},
        {
            // For maximum recompile speed:
            dev: 'last 2 Chrome versions',
            // A consuming package can optionally provide a list of browsers;
            // otherwise, use the defaults.
            prod: require('./browserslist'),
            // The Jest test runner provides a synthetic DOM, but  not a real
            // browser environment; instead, it's Node.
            test: 'node 10'
        },
        opts.targets
    );

    const envConfigs = {
        development: {
            plugins: [...plugins, 'react-refresh/babel'],
            presets: [
                ['@babel/preset-env', { modules: false, targets: targets.dev }]
            ]
        },
        production: {
            plugins: [
                ...plugins,
                [
                    // Some supported browsers will not support generators.
                    '@babel/plugin-transform-runtime',
                    { helpers: true, regenerator: true }
                ]
            ],
            presets: [
                // Do not compile modules; leave them for Webpack to use for
                // tree-shaking based on import/export syntax.
                ['@babel/preset-env', { modules: false, targets: targets.prod }]
            ]
        },
        test: {
            // Since the test environment runs in Node, dynamic import is not
            // natively supported.
            plugins: [...plugins, ['babel-plugin-dynamic-import-node']],
            presets: [
                [
                    '@babel/preset-env',
                    { modules: 'commonjs', targets: targets.test }
                ]
            ]
        }
    };
    return envConfigs[api.env() || 'development'];
};

module.exports = config;
