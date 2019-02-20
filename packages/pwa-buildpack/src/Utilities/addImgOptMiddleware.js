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

function addImgOptMiddleware(app, env = process.env) {
    const imgOptConfig = {
        baseHost: env.MAGENTO_BACKEND_URL,
        mountPoint: env.IMAGE_SERVICE_PATH,
        cacheExpires: env.IMAGE_CACHE_EXPIRES,
        debugCache: env.IMAGE_CACHE_DEBUG,
        redis: env.IMAGE_CACHE_REDIS_CLIENT
    };
    debug(
        `mounting onboard image optimization middleware express-sharp with config %o`,
        imgOptConfig
    );
    let cacheMiddleware;
    let sharpMiddleware;
    try {
        cacheMiddleware = cache(imgOptConfig.cacheExpires, null, {
            debug: imgOptConfig.debugCache,
            redisClient:
                imgOptConfig.redis &&
                require('redis').redisClient(imgOptConfig.redis)
        });
    } catch (e) {
        markDepInvalid('apicache', e);
    }
    try {
        sharpMiddleware = expressSharp({
            baseHost: imgOptConfig.baseHost
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
        app.use(imgOptConfig.mountPoint, cacheMiddleware, sharpMiddleware);
    }
}

module.exports = addImgOptMiddleware;
