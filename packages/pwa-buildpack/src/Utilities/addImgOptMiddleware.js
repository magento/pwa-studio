const debug = require('../util/debug').makeFileLogger(__filename);
let cache;
let expressSharp;
const missingDeps = [];
try {
    cache = require('apicache').middleware;
} catch (e) {
    missingDeps.push('- apicache');
}
try {
    expressSharp = require('@magento/express-sharp');
} catch (e) {
    missingDeps.push('- @magento/express-sharp');
}

function addImgOptMiddleware(app, env = process.env) {
    if (missingDeps.length > 0) {
        console.warn(
            `Cannot add image optimization middleware due to missing dependencies:
${missingDeps.join('\n')}
Images will be served uncompressed.

If possible, install additional tools to build NodeJS native dependencies:
https://github.com/nodejs/node-gyp#installation`
        );
        return;
    }
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
    app.use(
        imgOptConfig.mountPoint,
        cache(imgOptConfig.cacheExpires, null, {
            debug: imgOptConfig.debugCache,
            redisClient:
                imgOptConfig.redis &&
                require('redis').redisClient(imgOptConfig.redis)
        }),
        expressSharp({
            baseHost: imgOptConfig.baseHost
        })
    );
}

module.exports = addImgOptMiddleware;
