const debug = require('debug')('upward-js:ComputedResolver');
const AbstractResolver = require('./AbstractResolver');

class ComputedResolver extends AbstractResolver {
    static get resolverType() {
        return 'computed';
    }
    static get telltale() {
        return 'computed';
    }
    async resolve() {
        debug('Computed resolver is meant for UPWARD PHP only.');

        return '';
    }
}

module.exports = ComputedResolver;
