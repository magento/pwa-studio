const https = require('https');
const { URL } = require('url');
const proxyMiddleware = require('http-proxy-middleware');
const ApolloClient = require('apollo-boost').default;
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const createAdminRestClient = require('./createAdminRestClient');
const express = require('express');

const middleware = () => {
    let assets = {};

    const Upward = express.Router();

    const fetchOptions = {
        agent: new https.Agent({ rejectUnauthorized: false })
    };

    const gqlClient = new ApolloClient({
        fetch,
        fetchOptions,
        uri: new URL('/graphql', process.env.MAGENTO_BACKEND_DOMAIN).toString()
    });
    const resolverQuery = gql`
        query resolveUrl($urlKey: String!) {
            urlResolver(url: $urlKey) {
                type
                id
            }
        }
    `;

    const adminRestClient = createAdminRestClient(
        process.env.MAGENTO_BACKEND_DOMAIN,
        process.env.MAGENTO_ADMIN_USERNAME,
        process.env.MAGENTO_ADMIN_PASSWORD
    );

    const tpt = ({ website, shell, resolver, assets}) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${website.name}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${assets.criticalCss}</style>
  </head>
  <body>
    <div id="root">${shell}</div>
    <script type="application/json" id="url-resolver">${resolver}</script>
    <script defer src="/js/client.js"></script>
  </body>
</html>
`;

    const proxy = proxyMiddleware(
        [process.env.MAGENTO_BACKEND_PRODUCT_MEDIA_PATH, '/graphql', '/rest'],
        {
            target: process.env.MAGENTO_BACKEND_DOMAIN,
            secure: false,
            changeOrigin: true,
            autoRewrite: true,
            cookieDomainRewrite: ''
        }
    );

    Upward.use(proxy);

    Upward.get(['/', '(/**)?/*.html'], async (req, res) => {
        const sitePromise = adminRestClient('store/websites').then(sites =>
            sites.find(site => site.code === process.env.MAGENTO_WEBSITE_CODE)
        );
        const resolverPromise = gqlClient
            .query({
                query: resolverQuery,
                variables: {
                    urlKey: req.path
                }
            })
            .then(({ data }) => data.urlResolver);

        try {
            const [website, resolver] = await Promise.all([
                sitePromise,
                resolverPromise
            ]);

            const resolverText = JSON.stringify(resolver, null, 1);

            if (resolver && resolver.type) {
                res.status(200).send(
                    tpt({ website, resolver: resolverText, shell: 'Loading!' })
                );
            } else {
                res.status(404).send(
                    tpt({ website, resolver: resolverText, shell: 'Not Found' })
                );
            }
        } catch (e) {
            res.status(500).send(e.stack);
        }
    });

    Upward.onCompilation = mapped => {
        assets = mapped;
    }

    return Upward;
};

class UpwardPlugin {
    constructor(devServer, inlineAssetMap) {
        this.devServer = devServer;
        this.inlineAssetMap = inlineAssetMap;
        const oldAfter = this.devServer.after;
        this.middleware = middleware();
        this.devServer.after = app => {
            if (oldAfter) oldAfter(app);
            app.use(this.middleware);
        }
    }
    apply(compiler) {
        const entryPointNames = Object.keys(compiler.options.entry);
        compiler.plugin('emit', (compilation, callback) => {
            const mapped = {};
            for (const entryName of entryPointNames) {
                const entryPoint = compilation.entrypoints[entryName];
                for (const chunk of entryPoint.chunks) {
                    for (const file of chunk.files) {
                        if (this.inlineAssetMap[file]) {
                            mapped[this.inlineAssetMap[file]] = compilation.assets[file].source();
                        }
                    }
                }
            }
            this.middleware.onCompilation(mapped);
            callback();
        });
    }
}

module.exports = UpwardPlugin;
