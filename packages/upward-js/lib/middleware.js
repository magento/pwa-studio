const debug = require('debug')('upward-js:middleware');
const jsYaml = require('js-yaml');
const UpwardServerError = require('./UpwardServerError');
const IOAdapter = require('./IOAdapter');
const buildResponse = require('./buildResponse');
const File = require('./File');

class UpwardMiddleware {
    constructor(upwardPath, env, io) {
        this.env = env;
        this.upwardPath = upwardPath;
        debug(`created for path ${upwardPath}`);
        this.io = io;
    }
    async load() {
        const { upwardPath } = this;
        try {
            this.yamlTxt = await (await File.create(
                this.io,
                upwardPath,
                'utf8'
            )).asBuffer();
        } catch (e) {
            throw new UpwardServerError(e, `unable to read file ${upwardPath}`);
        }
        debug(`read upward.yml file successfully`);
        try {
            this.definition = await jsYaml.safeLoad(this.yamlTxt);
        } catch (e) {
            throw new UpwardServerError(
                e,
                `error parsing ${upwardPath} contents: \n\n${this.yamlTxt}`
            );
        }
        debug(`parsed upward.yml file successfully: %o`, this.definition);
    }
    async getHandler() {
        return async (req, res, next) => {
            const errors = [];
            let response;
            try {
                response = await buildResponse(
                    this.io,
                    this.env,
                    this.definition,
                    req
                );
                if (typeof response === 'function') {
                    debug('buildResponse returned function');
                    response(req, res, next);
                    return;
                }
                if (isNaN(response.status)) {
                    errors.push(
                        `Non-numeric status! Status was '${response.status}'`
                    );
                }
                if (typeof response.headers !== 'object') {
                    errors.push(
                        `Resolved with a non-compliant headers object! Headers are: ${
                            response.headers
                        }`
                    );
                }
                if (
                    typeof response.body !== 'string' &&
                    typeof response.body.asStream !== 'function'
                ) {
                    errors.push(
                        `Resolved with an unrecognized body object! Body was '${
                            response.body
                        }'`
                    );
                }
            } catch (e) {
                errors.push(e.stack);
            }
            if (errors.length > 0) {
                next(
                    new UpwardServerError(
                        `Request did not evaluate to a valid response, because: \n${errors.join(
                            '\n'
                        )}`
                    )
                );
            } else {
                debug('status, headers, and body valid. responding');

                res.status(response.status).set(response.headers);

                if (response.body instanceof File) {
                    (await response.body.asStream()).pipe(res);
                } else {
                    res.send(response.body);
                }
            }
        };
    }
}

async function upwardJSMiddlewareFactory(
    upwardPath,
    env,
    io = IOAdapter.default(upwardPath)
) {
    const middleware = new UpwardMiddleware(upwardPath, env, io);
    await middleware.load();
    return middleware.getHandler();
}

upwardJSMiddlewareFactory.UpwardMiddleware = UpwardMiddleware;

module.exports = upwardJSMiddlewareFactory;
