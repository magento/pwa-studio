require('dotenv').config();
const path = require('path');
const { readFileSync, existsSync } = require('fs');
const { Base64 } = require('js-base64');
const { performance } = require('perf_hooks');

const { createHTML } = require('./utils/html-utils');
const {
    createDOM,
    addHttp2PushLinkHeader,
    ApolloExtractor
} = require('./Utilities');

const { ChunkExtractor } = require('@loadable/server');
const { getDataFromTree } = require('@apollo/client/react/ssr');

const React = require('react');
// Suppress useLayoutEffect since it's not SSR compatible
React.useLayoutEffect = () => void 0;
React.Suspense = props =>
    React.createElement(React.Fragment, null, props.children);

// TODO: Minify HTML
// const { minify } = require('html-minifier');
// const minifyHtml = data => minify(data, { collapseWhitespace: true, minifyCSS: true });

const { InMemoryCache } = require('../lib/Utilities');
const templatePath = path.resolve('./dist/index.html');
const template = existsSync(templatePath)
    ? readFileSync(templatePath, { encoding: 'utf-8' })
    : '';

module.exports = ({
    onBeforeRender = async () => true,
    onAfterRender = async (_, { content }) => content
} = {}) => async (req, res, next) => {
    // Match document type request (same as in venia-ui/upward.yml)
    if (
        /^\/health-check/.test(req.originalUrl) ||
        /^\/graphql/.test(req.originalUrl) ||
        /^\/(rest|media)(\/|$)/.test(req.originalUrl) ||
        /^\/(robots\.txt|favicon\.ico|manifest\.json)/.test(req.originalUrl) ||
        /\.(js|json|png|jpe?g|gif|svg|ico|css|txt|woff|woff2)/.test(
            req.originalUrl
        )
    ) {
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

    let shouldSSR = true;
    let content = '';
    let scriptTags = '';
    let linkTags = '';

    // Class to inject into App and extract the Apollo state after
    const apolloExtractor = new ApolloExtractor();
    // Context object for Helmet
    const helmetContext = {};
    // Context object for StaticRouter
    const staticContext = {
        cookies: {},
        linkTags: ''
    };
    let hasError = false;

    const url = req.url;

    try {
        // Allow or disallow SSR depending on the request url.
        // Pass ApolloExtractor in to be able to alter Apollo cache state via ApolloExtractor.onInit
        shouldSSR = await onBeforeRender(url, apolloExtractor);

        // Render application
        if (shouldSSR) {
            const { default: App } = nodeExtractor.requireEntrypoint();

            const fullUrl = `${req.protocol}://${req.headers.host}${req.url}`;
            const jsx = webExtractor.collectChunks(
                React.createElement(
                    App,
                    {
                        apolloExtractor,
                        helmetContext,
                        staticContext,
                        url,
                        origin: `${req.protocol}://${req.headers.host}`,
                        // Use it for simulated browser API's (e.g. DOMParser) on server. Note: Do not assign it to global.
                        dom: createDOM(template, fullUrl),
                        // TODO: Check why Babel couldn't compile it properly and why we have to precompile in ssr/lib/Utilities/InMemoryCache.js
                        cache: new InMemoryCache({
                            // Add store_view_currency to cache config in order to read it in custom type policy 'read' function
                            ...(req.cookies || {})
                        }),
                        cookies: req.cookies
                    },
                    null
                )
            );

            content = await getDataFromTree(jsx);
        }
    } catch (error) {
        console.error(error);

        hasError = true;
        res.setHeader('x-ssr-failed', JSON.stringify(error.message));
    }
    // Prevent apicache from applying "Cache-control: no-cache"
    res.setHeader('x-apicache-bypass', 'true');

    Object.entries(staticContext.cookies).forEach(([key, value]) => {
        res.cookie(key, value);
    });

    if (staticContext.status === 301 || staticContext.status === 302) {
        const redirectUrl = `${req.get('x-forwarded-proto') ||
            req.protocol}://${req.get('host')}/${staticContext.url}`;
        res.redirect(staticContext.status, redirectUrl);
    } else {
        // Set status to 200 if status code has not been set inside React
        if (!staticContext.status) {
            staticContext.status = 200;
        }

        const shouldRenderContent =
            shouldSSR && !hasError && staticContext.status === 200;

        // Extract Helmet tags
        if (helmetContext.helmet) {
            const { title, meta, link, style } = helmetContext.helmet;
            linkTags +=
                title.toString() +
                meta.toString() +
                link.toString() +
                style.toString();
        }

        if (staticContext.linkTags) {
            linkTags += staticContext.linkTags;
        }

        // Extract Apollo cache state and insert it into the template in order to restore it on client side
        const apolloState = apolloExtractor.extract();

        const apolloStateNormalized = process.env.ENCODE_APOLLO_STATE
            ? `"${Base64.encode(JSON.stringify(apolloState))}"`
            : JSON.stringify(apolloState).replace(/</g, '\\u003c');

        scriptTags += `<script>window.__APOLLO_STATE__=${apolloStateNormalized};</script>`;

        // For altering response object after render
        if (shouldRenderContent) {
            content = await onAfterRender(res, {
                apolloState,
                url,
                content
            });
        }

        // Clear apollo state
        apolloExtractor.clear();

        // Sort order of preload link tags: css, other.
        const bundleLinkTags = webExtractor
            .getLinkTags()
            .split('\n')
            .sort((a, b) => (/\.css/.test(a) && !/\.css/.test(b) ? -1 : 1))
            .join('\n');

        const bundleStyleTags = webExtractor.getStyleTags();

        // Create the final HTML
        const html = createHTML(template, {
            head: bundleLinkTags + bundleStyleTags + linkTags,
            content: shouldRenderContent ? content : '',
            body: scriptTags + webExtractor.getScriptTags()
        });

        const fontLinkTags = html.match(/<link[^>]*\.woff2?[^>]*\/?>/);

        const http2PushPreloadLinkTags = bundleLinkTags
            .split(/\n/)
            .concat(fontLinkTags ? Array.from(fontLinkTags) : []);

        // HTTP/2 PUSH bundles and fonts
        addHttp2PushLinkHeader(res, http2PushPreloadLinkTags);

        res.status(staticContext.status).send(html);
        res.end();
    }

    // Debug end
    const time = performance.now() - start;
    console.log(`[SSR] Rendering ${url} took ${time} to complete.`);
};
