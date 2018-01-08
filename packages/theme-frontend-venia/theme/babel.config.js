// define default preset list
const presets = [];

// define default plugin list
const plugins = [
    'syntax-dynamic-import',
    'syntax-jsx',
    'transform-class-properties',
    'transform-object-rest-spread',
    ['transform-react-jsx', { pragma: 'createElement' }]
];

// define default babel options
const defaults = {
    babelrc: false,
    presets,
    plugins
};

// define target browsers for production
const browsers = {
    targets: {
        browsers: ['last 2 versions', 'ie >= 11']
    }
};

// group options by environment
const options = {
    development: Object.assign({}, defaults),
    production: Object.assign({}, defaults, {
        presets: [['babel-preset-env', browsers]]
    })
};

module.exports = env => options[env];
