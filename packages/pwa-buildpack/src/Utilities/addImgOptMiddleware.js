const cache = require('apicache').middleware;
const expressSharp = require('@magento/express-sharp');

function addImgOptMiddleware(
    mountPoint,
    app,
    {
        MAGENTO_BACKEND_URL: baseHost,
        IMAGE_CACHE_EXPIRES: cacheExpires,
        IMAGE_CACHE_DEBUG: debugCache,
        IMAGE_CACHE_REDIS_CLIENT: redis
    } = process.env
) {
    app.use(
        mountPoint,
        cache(cacheExpires, null, {
            debug: debugCache,
            redisClient: redis && require('redis').redisClient(redis)
        }),
        expressSharp({
            baseHost
        })
    );
}

module.exports = addImgOptMiddleware;
