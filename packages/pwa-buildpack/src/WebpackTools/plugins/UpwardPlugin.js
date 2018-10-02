const debug = require('../../util/debug').makeFileLogger(__filename);
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const upward = require('@magento/upward-js');

// To be used with `node-fetch` in order to allow self-signed certificates.
const agent = new https.Agent({ rejectUnauthorized: false });

class UpwardPlugin {
    constructor(devServer, upwardPath) {
        this.upwardPath = upwardPath;
        // Compose `after` function if something else has defined it.
        const oldAfter = devServer.after;
        devServer.after = app => {
            app.use((...args) => this.handleRequest(...args));
            if (oldAfter) oldAfter(app);
        };
    }
    // Hold the first request (and subsequent requests) until the middleware is
    // created, then swap out `handleRequest` for the simplest stack trace.
    async handleRequest(req, res, next) {
        // Several requests may come in. Only create the middleware once.
        if (!this.middlewarePromise) {
            this.middlewarePromise = this.createMiddleware();
        }
        await this.middlewarePromise;
        // When the promise is resolved, `this.middleware` will exist.
        // Replace this function itself.
        this.handleRequest = this.middleware;
        // And then call it to finish the response.
        this.middleware(req, res, next);
        // Further requests will go straight to the middleware.
    }
    async createMiddleware() {
        // The compiler is necessary to build the fallback filesystem
        // so UPWARd can use Webpack-generated assets in dev mode.
        const compiler = await this.getCompiler();

        // Standard filesystem-and-fetch IO.
        const defaultIO = upward.IOAdapter.default(this.upwardPath);

        // Use Webpack's in-memory file system for UPWARD file retrieval during
        // development. Allows for hot reloading of server-side configuration.

        const io = {
            async readFile(filepath, enc) {
                const absolutePath = path.resolve(filepath);

                // Most likely scenario: UPWARD needs an output asset.
                try {
                    return compiler.outputFileSystem.readFileSync(
                        absolutePath,
                        enc
                    );
                } catch (e) {}

                // Next most likely scenario: UPWARD needs a file on disk.
                try {
                    return defaultIO.readFile(absolutePath, enc);
                } catch (e) {}

                // Fallback: Use Webpack's resolution rules.
                return compiler.inputFileSystem.readFileSync(absolutePath, enc);
            },

            async networkFetch(path, options) {
                debug('networkFetch %s, %o', path, options);
                // Use the https.Agent to allow self-signed certificates.
                return fetch(path, Object.assign({ agent }, options));
            }
        };

        this.middleware = await upward.middleware(this.upwardPath, io);
    }
    async getCompiler() {
        if (this.compiler) {
            return this.compiler;
        }
        if (!this.compilerPromise) {
            // Create a promise for the compiler and expose its resolver so it
            // can be resolved when the `apply` method runs.
            this.compilerPromise = new Promise(resolve => {
                this.resolveCompiler = resolve;
            });
        }
        // Share the compiler promise.
        return this.compilerPromise;
    }
    apply(compiler) {
        this.compiler = compiler;
        // If a request has run to the devServer before this method has run,
        // then there is already a Promise pending for the compiler, and this is
        // its resolver.
        if (this.resolveCompiler) {
            this.resolveCompiler(compiler);
        }
    }
}

module.exports = UpwardPlugin;
