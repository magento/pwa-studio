const debug = require('debug')('upward-js:InlineResolver');
const { fromPairs, isPlainObject } = require('lodash');
const AbstractResolver = require('./AbstractResolver');
const isPrimitive = require('../isPrimitive');

class InlineResolver extends AbstractResolver {
    static get resolverType() {
        return 'inline';
    }
    static get telltale() {
        return 'inline';
    }
    async resolve({ inline }) {
        if (isPrimitive(inline)) {
            debug('quick-resolving primitive %s', inline);
            return inline;
        } else if (isPlainObject(inline)) {
            debug('resolving object %o', inline);
            const resolvedEntries = await Promise.all(
                Object.keys(inline).map(async key => [
                    key,
                    await this.visitor.upward(inline, key)
                ])
            );
            return fromPairs(resolvedEntries);
        }
        throw new Error(
            `Internal error: Invalid value supplied to InlineResolver: ${inline}`
        );
    }
}

module.exports = InlineResolver;
