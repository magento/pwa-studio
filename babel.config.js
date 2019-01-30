const browsers = require('./browserslist');
const chalk = require('chalk');

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

let warned = false;

const config = api => {
    if (process.env.WARN_RESOLVE) {
        warned = true;
        console.warn(
            chalk.bold.yellowBright(
                'You may see some warnings that @magento/venia-drivers could not be resolved. This is normal and not an error; Venia exports a virtual import path and babel-plugin-module-resolver is hardcoded to warn about it.'
            )
        );
    }
    const envConfigs = {
        /**
         * Watch mode and build:esm partial transpilation mode.
         * The module-resolver plugin makes Babel recognize import paths from
         * package root, like 'src/classify'.
         */
        development: {
            // Ignore __mocks__, __stories__, etc.
            ignore: [/\/__\w+__\//],
            plugins: [
                ...plugins,
                [
                    'module-resolver',
                    {
                        root: ['./'],
                        /**
                         * Exported modules will be consumed by other projects
                         * which import Venia. Those projects will need to
                         * override the 'src/drivers' dependency so Venia
                         * modules will run outside the Venia app. This alias
                         * exports the modules so the drivers dependency is
                         * a unique string '@magento/venia-drivers', which is
                         * less likely to collide with an existing dependency
                         * than 'src/drivers' is.
                         *
                         * In webpack (or any build system) config for a project
                         * using Venia modules, you must write an override for
                         * '@magento/venia-drivers' and make an alias to that
                         * module in your build configuration, e.g.:
                         *
                         *     alias: {
                         *       '@magento/venia-drivers': './src/veniaDrivers'
                         *     }
                         *
                         * to map from this virtual string to your replacement.
                         */
                        alias: {
                            '^src/drivers$': '@magento/venia-drivers'
                        }
                    }
                ]
            ],
            presets: [
                ['@babel/preset-env', { modules: false, targets: targets.dev }]
            ]
        },
        production: {
            plugins: [
                ...plugins,
                [
                    '@babel/plugin-transform-runtime',
                    { helpers: true, regenerator: true }
                ]
            ],
            presets: [
                ['@babel/preset-env', { modules: false, targets: targets.prod }]
            ]
        },
        test: {
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
