// define default preset list
const presets = [];

// define default plugin list
const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-react-jsx',
    'babel-plugin-graphql-tag',
    'babel-plugin-import-graphql'
];

// define default babel options
const defaults = {
    babelrc: false,
    presets,
    plugins
};

// define preset-env config for production
const presetEnvConfig = {
    targets: {
        browsers: ['> 5%']
    },
    modules: false
};

// group options by environment
const options = {
    development: Object.assign({}, defaults),
    production: Object.assign({}, defaults, {
        presets: [
            ...(defaults.presets || []),
            ['@babel/preset-env', presetEnvConfig]
        ],
        plugins: [
            ...(defaults.plugins || []),
            'babel-plugin-transform-react-remove-prop-types',
            [
                '@babel/plugin-transform-runtime',
                {
                    helpers: true,
                    regenerator: false
                }
            ]
        ]
    })
};

module.exports = env => options[env];
