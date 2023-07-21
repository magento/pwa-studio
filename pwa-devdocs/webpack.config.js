const path = require('path');

module.exports = {
    mode: 'production',

    entry: ['./src/_js/index.js'],
    output: {
        path: path.join(__dirname, './src/builds/js/'),
        filename: 'index.bundle.js',
        publicPath: '/builds/js/'
    },
};
