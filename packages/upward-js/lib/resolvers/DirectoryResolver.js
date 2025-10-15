const debug = require('debug')('upward-js:DirectoryResolver');
const path = require('path');
const serveStatic = require('express').static;
const AbstractResolver = require('./AbstractResolver');

const AllServers = new Map();
class DirectoryResolver extends AbstractResolver {
    static get resolverType() {
        return 'directory';
    }
    static get telltale() {
        return 'directory';
    }
    static get servers() {
        return AllServers;
    }
    async resolve(definition) {
        if (!definition.directory) {
            throw new Error(
                `Directory argument is required: ${JSON.stringify(definition)}`
            );
        }
        const directory = await this.visitor.upward(definition, 'directory');
        if (typeof directory !== 'string') {
            throw new Error(
                `'directory' argument to DirectoryResolver must be a string, but was a: ${typeof directory}`
            );
        }
        debug('resolved directory %s', directory);

        let server = DirectoryResolver.servers.get(directory);
        if (!server) {
            const staticOpts = {
                fallthrough: false,
                index: false,
                maxAge: process.env.NODE_ENV === 'production' ? 604800000 : 0
            };
            debug(
                `creating new server for directory "%s" relative to "%s" with options %o`,
                directory,
                this.visitor.upwardPath,
                staticOpts
            );

            const baseDir = path.resolve(
                path.dirname(this.visitor.upwardPath),
                directory
            );
            server = (req, res, next) => {
                const baseDirSegments = baseDir
                    .split(path.sep)
                    .filter(segment => segment);
                const lastBaseSegment =
                    baseDirSegments[baseDirSegments.length - 1];

                if (
                    lastBaseSegment &&
                    req.url.startsWith(`/${lastBaseSegment}/`)
                ) {
                    req.url = req.url.substring(`/${lastBaseSegment}`.length);
                    debug(
                        `Removed redundant path segment "${lastBaseSegment}" from request URL: ${
                            req.url
                        }`
                    );
                }

                const staticMiddleware = serveStatic(baseDir, staticOpts);
                staticMiddleware(req, res, next);
            };

            DirectoryResolver.servers.set(directory, server);
        }

        return server;
    }
}

module.exports = DirectoryResolver;
