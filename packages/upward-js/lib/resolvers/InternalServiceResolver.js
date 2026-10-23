const debug = require('debug')('upward-js:InternalServiceResolver');
const AbstractResolver = require('./AbstractResolver');

class InternalServiceResolver extends AbstractResolver {
    static get resolverType() {
        return 'internal_service';
    }

    static get telltale() {
        return 'internal_service';
    }

    async resolve() {
        debug('Internal service resolver is meant for UPWARD PHP only.');
        return {
            data: {
                route: {
                    relative_url: '',
                    redirect_code: 404,
                    type: null
                }
            }
        };
    }
}

module.exports = InternalServiceResolver;