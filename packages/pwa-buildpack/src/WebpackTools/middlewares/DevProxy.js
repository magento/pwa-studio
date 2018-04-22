const proxy = require('http-proxy-middleware');

module.exports = function createDevProxy(
    target,
    { passthru },
    logLevel = 'debug'
) {
    const noDot = passthru.map(x => x.replace(/^\./, ''));
    return proxy(['**', `!**/*.{${noDot.join(',')}}`], {
        target,
        logLevel,
        secure: false,
        changeOrigin: true
    });
};
