const traverse = require('traverse');
const InternalContextResolver = require('./resolvers/InternalContextResolver');
const REQUIRED_TOP_LEVEL = ['status', 'headers', 'body'];
class ResolverTree {
    constructor(config) {
        const missingText = REQUIRED_TOP_LEVEL.reduce((text, prop) => {
            return (
                text +
                (config.hasOwnProperty(prop)
                    ? ''
                    : `'${prop}' must be a defined property at top level!\n`)
            );
        }, '');
        if (missingText) {
            throw new Error(`Invalid configuration: \n${missingText}`);
        }
        this.context = context;
        this.config = config;
    }
    async hydrate() {
    }
    async prepareForRequests(context) {
        this.initialContext = context;
        await this.hydrate();

        await Promise.all(
            this.resolutionPaths.filter(path => (
                REQUIRED_TOP_LEVEL.includes(path[0]) &&
                !path.includes(request)
            ).map(async path => {

            })
        })
    }
}

module.exports = ResolverTree;
