const debug = require('../util/debug').makeFileLogger(__filename);
const cache = require('apicache').middleware;
const expressSharp = require('@magento/express-sharp');

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
