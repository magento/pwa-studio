const debug = require('debug')('upward-js:DirectoryResolver');
const serveStatic = require('express').static;
const AbstractResolver = require('./AbstractResolver');

class DirectoryResolver extends AbstractResolver {
    static get resolverType() {
        return 'directory';
    }
    static get telltale() {
        return 'directory';
    }
    constructor(...args) {
        super(...args);
        this.servers = new Map();
    }
    async resolve(definition) {
        if (!definition.directory) {
            throw new Error(
                `Directory argument is required: ${JSON.stringify(definition)}`
            );
        }
        const directory = await this.visitor.upward(definition, 'directory');
        if (typeof directory !== 'string') {
            throw new Error(`'directory' argument to DirectoryResolver must be a string, but was a: ${typeof directory}`);
        }
        debug( 'resolved directory %s', directory);

        let server = this.servers.get(directory);
        if (!server) {
            debug(`creating new server for ${directory}`);
            server = serveStatic(directory, {
                fallthrough: false,
                index: false
            });
            this.servers.set(directory, server);
        }

        return server;
    }
}

module.exports = DirectoryResolver;
