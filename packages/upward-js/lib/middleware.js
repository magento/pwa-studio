const debug = require('debug')('upward-js:middleware');
const jsYaml = require('js-yaml');
const UpwardServerError = require('./UpwardServerError');
const IOAdapter = require('./IOAdapter');
const buildResponse = require('./buildResponse');

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
            this.yamlTxt = await this.io.readFile(upwardPath);
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
                    req,
                    this.upwardPath
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
                    typeof response.body.toString !== 'function'
                ) {
                    errors.push(
                        `Resolved with a non-serializable body! Body was '${Object.prototype.toString.call(
                            response.body
                        )}'`
                    );
                }
            } catch (e) {
                errors.push(e.message);
            }
            if (errors.length > 0) {
                if (this.env.NODE_ENV === 'production') {
                    res.status(500);
                    res.format({
                        json() {
                            res.json({
                                errors: [
                                    {
                                        status: 500,
                                        message: 'Server Error'
                                    }
                                ]
                            });
                        },
                        html() {
                            res.send('500 Server Error');
                        }
                    });
                } else {
                    res.format({
                        json() {
                            res.status(500).json({
                                errors: errors.map(message => ({ message }))
                            });
                        },
                        html() {
                            next(
                                new UpwardServerError(
                                    `Request did not evaluate to a valid response, because: \n${errors.join(
                                        '\n\n'
                                    )}`
                                )
                            );
                        }
                    });
                }
            } else {
                debug('status, headers, and body valid. responding');
                res.status(response.status)
                    .set(response.headers)
                    .send(
                        typeof response.body === 'string' ||
                            Buffer.isBuffer(response.body)
                            ? response.body
                            : response.body.toString()
                    );
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
