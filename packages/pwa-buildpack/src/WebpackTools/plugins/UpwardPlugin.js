const debug = require('../../util/debug').makeFileLogger(__filename);
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const url = require('url');
const upward = require('@magento/upward-js');

// To be used with `node-fetch` in order to allow self-signed certificates.
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

class UpwardPlugin {
    constructor(devServer, env, upwardPath) {
        this.env = Object.assign(
            {
                NODE_ENV: 'development'
            },
            env
        );
        this.upwardPath = upwardPath;
        // Compose `after` and `before` functions if something else has defined
        // them.
        const oldBefore = devServer.before;
        devServer.before = (app, ...rest) => {
            app.use(upward.bestPractices());
            if (oldBefore) oldBefore(app, ...rest);
        };
        const oldAfter = devServer.after;
        devServer.after = (app, ...rest) => {
            if (oldAfter) oldAfter(app, ...rest);
            app.use((req, res, next) => this.handleRequest(req, res, next));
        };
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
                const absolutePath = path.resolve(
                    compiler.options.output.path,
                    filepath
                );
                // Most likely scenario: UPWARD needs an output asset.
                debug('readFile %s %s', filepath, enc);
                try {
                    return compiler.outputFileSystem.readFileSync(
                        absolutePath,
                        enc
                    );
                } catch (e) {
                    debug(
                        'outputFileSystem %s %s. Trying defaultIO...',
                        filepath,
                        e.message
                    );
                }
                // Next most likely scenario: UPWARD needs a file on disk.
                try {
                    const fromDefault = await defaultIO.readFile(filepath, enc);
                    return fromDefault;
                } catch (e) {
                    debug(
                        'defaultIO %s %s. Trying inputFileSystem...',
                        filepath,
                        e.message
                    );
                }

                try {
                    // Fallback: Use Webpack's resolution rules.
                    return compiler.inputFileSystem.readFileSync(filepath, enc);
                } catch (e) {
                    debug(
                        'inputFileSystem %s %s. Must throw...',
                        filepath,
                        e.message
                    );
                    throw e;
                }
            },

            async networkFetch(path, options) {
                debug('networkFetch %s, %o', path, options);
                const { protocol } = new url.URL(path);
                if (protocol === 'https:') {
                    return fetch(
                        path,
                        Object.assign({ agent: httpsAgent }, options)
                    );
                }
                return fetch(path, options);
                // Use the https.Agent to allow self-signed certificates.
            }
        };

        this.middleware = await upward.middleware(
            this.upwardPath,
            this.env,
            io
        );
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
}

module.exports = UpwardPlugin;
