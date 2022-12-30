require('dotenv').config();
const path = require('path');
const { readFileSync, existsSync } = require('fs');
const { performance } = require('perf_hooks');
const { ChunkExtractor } = require('@loadable/server');
const { getDataFromTree } = require('@apollo/client/react/ssr');

const { createDOM, InMemoryCache } = require('./Utilities');
const { isDocument, buildHTML } = require('./utils');
require('./utils/shim');

// TODO: Minify HTML
// const { minify } = require('html-minifier');
// const minifyHtml = data => minify(data, { collapseWhitespace: true, minifyCSS: true });

const templatePath = path.resolve('./dist/index.html');
const template = existsSync(templatePath)
    ? readFileSync(templatePath, { encoding: 'utf-8' })
    : '';

module.exports = ({
    onBeforeRender = async () => true,
    onAfterRender = async (_, { content }) => content
} = {}) => async (req, res, next) => {
    if (!isDocument(req)) {
        next();
        return;
    }

    // Debug start
    const start = performance.now();

    const nodeStatsFile = path.resolve('./node/loadable-stats.json');
    const nodeExtractor = new ChunkExtractor({
        statsFile: nodeStatsFile,
        entrypoints: ['client']
    });
    const webStatsFile = path.resolve('./loadable-stats.json');
    const webExtractor = new ChunkExtractor({
        statsFile: webStatsFile,
        entrypoints: ['client']
    });

    const { url } = req;
    let shouldSSR = true;
    let isError = false;
    let content = '';

    // Context object for StaticRouter
    const staticContext = {
        status: 200,
        apollo: {
            client: null,
            // TODO: Find out why Babel couldn't compile it properly when imported
            // and why we have to precompile to ssr/lib/Utilities/InMemoryCache.js
            cache: new InMemoryCache({
                // Add store_view_currency to cache config in order to read it in custom type policy 'read' function
                ...(req.cookies || {})
            })
        },
        cookies: {},
        linkTags: ''
    };
    // Context object for Helmet
    const helmetContext = {};

    try {
        // Allow or disallow SSR depending on the request url.
        shouldSSR = await onBeforeRender(url);

        // Render application
        if (shouldSSR) {
            const { default: App } = nodeExtractor.requireEntrypoint();

            const jsx = webExtractor.collectChunks(
                React.createElement(
                    App,
                    {
                        url,
                        origin: `${req.protocol}://${req.headers.host}`,
                        cookies: req.cookies,
                        staticContext,
                        helmetContext,
                        // Use it for simulated browser API's (e.g. DOMParser) on server. Note: Do not assign it to global.
                        dom: createDOM(
                            template,
                            `${req.protocol}://${req.headers.host}${url}`
                        )
                    },
                    null
                )
            );

            content = await getDataFromTree(jsx);
        }
    } catch (error) {
        isError = true;
        res.setHeader('x-ssr-failed', JSON.stringify(error.message));
        console.error(error);
    }

    if (staticContext.status === 301 || staticContext.status === 302) {
        const protocol = req.get('x-forwarded-proto') || req.protocol;
        const redirectUrl = `${protocol}://${req.get('host')}/${
            staticContext.url
        }`;
        res.redirect(staticContext.status, redirectUrl);
    } else {
        const shouldRenderContent =
            shouldSSR && !isError && staticContext.status === 200;

        const apolloClient = staticContext.apollo.client;
        const apolloState = apolloClient ? apolloClient.extract() : {};

        // Possibility to alter the response after the render has been finished
        if (shouldRenderContent) {
            const modifiedContent = await onAfterRender(res, {
                url,
                apolloState,
                content
            });

            content = modifiedContent;
        }

        // Build the final HTML
        const html = buildHTML(
            template,
            shouldRenderContent ? content : '',
            webExtractor,
            helmetContext,
            staticContext,
            apolloState
        );

        // Clear apollo state
        if (apolloClient) {
            apolloClient.clearStore();
        }

        // Assign cookies set during the render
        Object.entries(staticContext.cookies).forEach(([key, value]) => {
            res.cookie(key, value);
        });

        // Prevent apicache from applying "Cache-control: no-cache"
        res.setHeader('x-apicache-bypass', 'true');

        res.status(staticContext.status).send(html);
        res.end();
    }

    // Debug end
    const time = performance.now() - start;
    console.log(`[SSR] Rendering ${url} took ${time} to complete.`);
};
