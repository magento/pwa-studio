const debug = require('../util/debug').makeFileLogger(__filename);
const { URL, URLSearchParams } = require('url');
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
/**
 * TODO: Make a better test for this. The logic which determines whether
 * a URL is an image to be optimized should be centralized, ideally in
 * UPWARD, and then used in various places: here, the UPWARD resolution
 * path itself, the `makeURL` function in the client, etc.
 */
const wantsResizing = req => !!req.query.width;

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
        cacheMiddleware = cache(imgOptConfig.cacheExpires, wantsResizing, {
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
        const toExpressSharpUrl = (incomingUrl, incomingQuery) => {
            const imageUrl = new URL(incomingUrl, imgOptConfig.baseHost);
            debug('imageUrl', imageUrl);

            const optParamNames = ['auto', 'format', 'width'];

            const rewritten = new URL(
                `https://0.0.0.0/resize/${incomingQuery.width}`
            );

            // Start with the original search params, so
            // we can preserve any non-imageopt parameters
            // others might want.
            const params = new URLSearchParams(imageUrl.search);
            for (const param of optParamNames) {
                params.delete(param);
            }
            params.set('url', imageUrl.pathname);
            if (incomingQuery.format === 'pjpg') {
                params.set('progressive', 'true');
            }
            if (incomingQuery.auto === 'webp') {
                params.set('format', 'webp');
            }
            rewritten.search = params.toString();

            debug({ rewritten });

            // make relative url
            const url = rewritten.href.slice(rewritten.origin.length);

            // make new query object for express-sharp to use
            const query = {};
            for (const [key, value] of params) {
                query[key] = value;
            }
            debug({ url, query });
            return { url, query };
        };
        const filterAndRewriteSharp = (req, res, next) => {
            if (wantsResizing(req)) {
                const { url, query } = toExpressSharpUrl(req.url, req.query);
                req.url = url;
                req.query = query;
                res.set('X-Image-Compressed-By', 'PWA Studio Staging Server');
                sharpMiddleware(req, res, next);
            } else {
                next();
            }
        };
        app.use(cacheMiddleware, filterAndRewriteSharp);
    }
}

module.exports = addImgOptMiddleware;
