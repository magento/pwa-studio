const debug = require('../util/debug').makeFileLogger(__filename);
let cache;
let expressSharp;
let missingDeps = '';
const markDepInvalid = (dep, e) => {
    missingDeps += `- ${dep}: Reason: ${e.message.split('\n')[0]}\n`;
};
try {
    cache = require('apicache').middleware;
} catch (e) {
    markDepInvalid('apicache', e);
}
try {
    expressSharp = require('@magento/express-sharp');
} catch (e) {
    markDepInvalid('@magento/express-sharp', e);
}

function addImgOptMiddleware(app, config) {
    const { backendUrl, cacheExpires, cacheDebug, publicPath, redis } = config;
    debug(
        `mounting onboard image optimization middleware express-sharp with backend %s`,
        backendUrl
    );
    let cacheMiddleware;
    let sharpMiddleware;
    try {
        cacheMiddleware = cache(cacheExpires, null, {
            debug: cacheDebug,
            redisClient: redis && require('redis').redisClient(redis)
        });
    } catch (e) {
        markDepInvalid('apicache', e);
    }
    try {
        sharpMiddleware = expressSharp({
            baseHost: backendUrl
        });
    } catch (e) {
        markDepInvalid('@magento/express-sharp', e);
    }
    if (missingDeps) {
        console.warn(
            `Cannot add image optimization middleware due to dependencies that are not installed or are not compatible with this environment:
${missingDeps}
Images will be served uncompressed.

If possible, install additional tools to build NodeJS native dependencies:
https://github.com/nodejs/node-gyp#installation`
        );
    } else {
        app.use(publicPath, cacheMiddleware, sharpMiddleware);
    }
}

module.exports = addImgOptMiddleware;
