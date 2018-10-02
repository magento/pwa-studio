const debug = require('../../util/debug').makeFileLogger(__filename);
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const express = require('express');
const upward = require('@magento/upward-js');

const agent = new https.Agent({ rejectUnauthorized: false });

const middleware = upwardPath => {
    // let assets = {};
    let compiler;

    const app = express.Router();

    const defaultIO = upward.IOAdapter.default(upwardPath);

    /**
     * Use Webpack's in-memory file systemn for UPWARD file retrieval during
     * development. Allows for hot reloading of server-side configuration.
     */
    const io = {
        async readFile(filepath, enc) {
            const absolutePath = path.resolve(filepath);
            try {
                return compiler.outputFileSystem.readFileSync(
                    absolutePath,
                    enc
                );
            } catch (e) {}
            try {
                return defaultIO.readFile(absolutePath, enc);
            } catch (e) {}
            try {
                return compiler.inputFileSystem.readFileSync(absolutePath, enc);
            } catch (e) {}
        },
        async networkFetch(path, options) {
            debug('networkFetch %s, %o', path, options);
            return fetch(path, Object.assign({ agent }, options));
        }
    };

    // const proxy = proxyMiddleware(
    //     [
    //         process.env.MAGENTO_BACKEND_PRODUCT_MEDIA_PATH,
    //         '/graphql',
    //         '/rest',
    //         '/favicon.ico'
    //     ],
    //     {
    //         target: process.env.MAGENTO_BACKEND_DOMAIN,
    //         secure: false,
    //         changeOrigin: true,
    //         autoRewrite: true,
    //         cookieDomainRewrite: ''
    //     }
    // );

    // app.use(proxy);

    // UPWARD middleware must be asynchronously generated, but plugins must
    // apply their changes synchronously. Use a proxy function to add a
    // middleware which lazy loads UPWARD when it's time.
    let upwardMiddleware;
    let upwardMiddlewarePromise = new Promise((resolve, reject) => {});
    app.use(async (req, res, next) => {
        if (!upwardMiddleware) {
            upwardMiddleware = await upward.middleware(upwardPath, io);
        }
        upwardMiddleware(req, res, next);
    });

    return app;
};

class UpwardPlugin {
    constructor(devServer, upwardPath) {
        this.devServer = devServer;
        // Compose `after` function if something else has defined it.
        const oldAfter = this.devServer.after;
        this.middleware = middleware(upwardPath);
        this.devServer.after = app => {
            app.use(this.middleware);
            if (oldAfter) oldAfter(app);
        };
    }
    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            this.middleware.onBuild(compiler, compilation);
            callback();
        });
    }
}

module.exports = UpwardPlugin;
