const plugins = [
    /**
     * See:
     * https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
     * https://babeljs.io/docs/en/babel-plugin-proposal-object-rest-spread
     * https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining
     * https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
     * https://babeljs.io/docs/en/next/babel-plugin-syntax-jsx.html
     * https://babeljs.io/docs/en/babel-plugin-transform-react-jsx
     * https://www.npmjs.com/package/babel-plugin-graphql-tag
     */
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/plugin-syntax-jsx'],
    ['@babel/plugin-transform-react-jsx'],
    ['babel-plugin-graphql-tag']
];

const nodeTarget = 'node 10';

const config = (api, opts = {}) => {
    const isWebTarget = api.caller(
        caller => caller && caller.target !== 'node'
    );
    const isWebpack = api.caller(
        caller => caller && caller.name === 'babel-loader'
    );

    // Different environments, different settings for preset-env.
    const targets = Object.assign(
        {},
        {
            // For maximum recompile speed:
            dev: isWebTarget ? 'last 2 Chrome versions' : nodeTarget,
            // A consuming package can optionally provide a list of browsers;
            // otherwise, use the defaults.
            prod: isWebTarget ? require('./browserslist') : nodeTarget,
            // The Jest test runner provides a synthetic DOM, but  not a real
            // browser environment; instead, it's Node.
            test: nodeTarget
        },
        opts.targets
    );

    const babelKeepAttributes =
        process.env.BABEL_KEEP_ATTRIBUTES &&
        process.env.BABEL_KEEP_ATTRIBUTES === 'true';

    const removeAttributesPlugin = babelKeepAttributes
        ? []
        : [
              [
                  'babel-plugin-react-remove-properties',
                  { properties: ['data-cy'] }
              ]
          ];

    const devPlugins = [];
    if (isWebTarget) {
        devPlugins.push(['react-refresh/babel']);
    }

    if (!isWebTarget) {
        plugins.push(['babel-plugin-dynamic-import-node']);
    }

    const modules = isWebpack ? false : 'commonjs';

    const envConfigs = {
        development: {
            plugins: [...plugins, ...devPlugins],
            presets: [['@babel/preset-env', { modules, targets: targets.dev }]]
        },
        production: {
            plugins: [
                ...plugins,
                ...removeAttributesPlugin,
                [
                    // Some supported browsers will not support generators.
                    '@babel/plugin-transform-runtime',
                    { helpers: true, regenerator: true }
                ]
            ],
            presets: [
                // Do not compile modules; leave them for Webpack to use for
                // tree-shaking based on import/export syntax.
                ['@babel/preset-env', { modules, targets: targets.prod }]
            ]
        },
        test: {
            // Since the test environment runs in Node, dynamic import is not
            // natively supported.
            plugins: [
                ...plugins,
                ...removeAttributesPlugin,
                ['babel-plugin-dynamic-import-node']
            ],
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
