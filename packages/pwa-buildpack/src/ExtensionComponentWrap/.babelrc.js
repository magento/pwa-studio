const browsers = require('../../../../browserslist');

const config = {
    extends: '../../.babelrc.js',
    presets: [['@babel/preset-env', { targets: browsers }]]
};

module.exports = config;
