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

function addImgOptMiddleware(app, config) {
    const { backendUrl, cacheExpires, cacheDebug, redisClient } = config;
    debug(
        `mounting onboard image optimization middleware express-sharp with backend %s`,
        backendUrl
    );

    let cacheMiddleware;
    let sharpMiddleware;
    try {
        cacheMiddleware = cache(cacheExpires, wantsResizing, {
            debug: cacheDebug,
            redisClient:
                redisClient && require('redis').redisClient(redisClient)
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
        const toExpressSharpUrl = (incomingUrl, incomingQuery) => {
            const imageUrl = new URL(incomingUrl, backendUrl);
            debug('imageUrl', imageUrl);

            const optParamNames = ['auto', 'format', 'width', 'height'];

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

            const { width, height } = incomingQuery;
            let rewrittenUrl = `https://0.0.0.0/resize/${width}`;

            // If we received height and width we should force crop since our
            // implementation of express sharp defaults fit to "outside" if crop
            // is falsy. `outside` sizes the image, retaining the aspect ratio
            // but may fall "outside" the desired height or width. `cover`
            // retains the aspect ratio like `outside` but clips to fit desired
            // height and width.
            //   https://github.com/magento-research/express-sharp/blob/develop/lib/transform.js#L23
            //   https://sharp.pixelplumbing.com/en/stable/api-resize/
            if (height) {
                rewrittenUrl += `/${height}`;
                params.set('crop', true);
            }

            const rewritten = new URL(rewrittenUrl);
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
