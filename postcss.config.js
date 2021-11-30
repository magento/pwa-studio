// This file exists to work around a problem with hoisting in Yarn v1.
// https://github.com/webpack-contrib/postcss-loader/issues/405
// https://github.com/yarnpkg/yarn/issues/7572
const path = require('path');
const root = path.resolve(__dirname, './packages/venia-concept');

module.exports = {
    plugins: [
        require('autoprefixer'),
        require('tailwindcss')(path.resolve(root, './tailwind.config.js'))
    ]
};
