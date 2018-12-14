const debug = require('../../util/debug').makeFileLogger(__filename);
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const url = require('url');
const upward = require('@magento/upward-js');
const stringToStream = require('from2-string');

// To be used with `node-fetch` in order to allow self-signed certificates.
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

class UpwardPlugin {
    constructor(devServer, env, upwardPath) {
        this.env = env;
        this.upwardPath = upwardPath;
        // Compose `after` function if something else has defined it.
        const oldAfter = devServer.after;
        devServer.after = (app, ...rest) => {
            app.use((req, res, next) => this.handleRequest(req, res, next));
            if (oldAfter) oldAfter(app, ...rest);
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
        const tryWebpackFs = (method, handleWebpackOutput) => async (
            ...allArgs
        ) => {
            const [filepath, ...rest] = allArgs;
            let ioError;
            // Most likely scenario: UPWARD needs an output asset.
            debug(
                '%s trying Webpack outputFileSystem: %s %o',
                method,
                filepath,
                ...rest
            );
            try {
                const absolutePath = path.resolve(
                    compiler.options.output.path,
                    filepath
                );
                const output = await handleWebpackOutput(
                    compiler.outputFileSystem.readFileSync(
                        absolutePath,
                        ...rest
                    ),
                    ...allArgs
                );
                return output;
            } catch (e) {
                debug(
                    '%s Webpack outputFileSystem %s %s. Trying defaultIO...',
                    method,
                    filepath,
                    e.message
                );
            }
            try {
                const output = await defaultIO[method](...allArgs);
                return output;
            } catch (e) {
                ioError = e;
                debug(
                    'defaultIO.%s %s %s. Trying Webpack inputFileSystem...',
                    method,
                    filepath,
                    e.message
                );
            }
            try {
                const output = await handleWebpackOutput(
                    compiler.inputFileSystem.readFileSync(...allArgs),
                    ...allArgs
                );
                return output;
            } catch (e) {
                debug(
                    '%s Webpack inputFileSystem %s %s. Must throw now.',
                    method,
                    filepath,
                    e.message
                );
            }
            throw ioError;
        };

        const io = {
            createReadFileStream: tryWebpackFs(
                'createReadFileStream',
                stringToStream
            ),
            getFileSize: tryWebpackFs('getFileSize', (str, filePath, enc) =>
                Buffer.byteLength(str, enc)
            ),
            async networkFetch(uri, options) {
                debug('networkFetch %s, %o', uri, options);
                const { protocol } = url.parse(uri);
                if (protocol === 'https:') {
                    return fetch(
                        uri,
                        Object.assign({ agent: httpsAgent }, options)
                    );
                }
                return fetch(uri, options);
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
