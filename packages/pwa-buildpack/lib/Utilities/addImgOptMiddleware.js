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
/**
 * TODO: Make a better test for this. The logic which determines whether
 * a URL is an image to be optimized should be centralized, ideally in
 * UPWARD, and then used in various places: here, the UPWARD resolution
 * path itself, the `makeURL` function in the client, etc.
 */
const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/;
const imageParameters = ['auto', 'format', 'width', 'height', 'quality'];
const wantsResizing = req =>
    req.method === 'GET' &&
    imageExtensions.test(req.path) &&
    imageParameters.some(param => param in req.query);

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
        const toExpressSharpQuery = query => {
            // Venia's makeUrl expects the Fastly style of imageopto params.
            // https://docs.fastly.com/api/imageopto/
            // Rewrite them just a little bit.
            switch (query.format) {
                case 'pjpg':
                    query.progressive = true;
                    query.format = 'jpeg';
                    break;
                case 'jpg':
                    query.format = 'jpeg';
                    break;
                default:
                    break;
            }
            // If we received height and width we should force crop since our
            // implementation of express sharp defaults fit to "outside" if crop
            // is falsy. `outside` sizes the image, retaining the aspect ratio
            // but may fall "outside" the desired height or width. `cover`
            // retains the aspect ratio like `outside` but clips to fit desired
            // height and width.
            //   https://github.com/magento-research/express-sharp/blob/develop/lib/transform.js#L23
            //   https://sharp.pixelplumbing.com/en/stable/api-resize/
            if (query.width && query.height) {
                query.crop = true;
            }

            debug('rewrote query to %o', query);
        };

        const filterAndRewriteSharp = (req, res, next) => {
            if (wantsResizing(req)) {
                try {
                    toExpressSharpQuery(req.query);
                    res.set(
                        'X-Image-Compressed-By',
                        'PWA Studio Staging Server'
                    );
                    debug(`delegate ${req.url.toString()} to sharpMiddleware`);
                    sharpMiddleware(req, res, next);
                } catch (e) {
                    res.status(500).send(e);
                }
            } else {
                debug(`${req.url.toString()} does not appear to want resizing`);
                next();
            }
        };
        app.use(cacheMiddleware, filterAndRewriteSharp);
    }
}

module.exports = addImgOptMiddleware;
