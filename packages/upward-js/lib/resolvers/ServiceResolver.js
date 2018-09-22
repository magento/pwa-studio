const debug = require('debug')('upward-js:ServiceResolver');
const { inspect } = require('util');
const { execute, makePromise } = require('apollo-link');
const { HttpLink } = require('apollo-link-http');
const { isPlainObject } = require('lodash');
const AbstractResolver = require('./AbstractResolver');
const GraphQLDocument = require('../compiledResources/GraphQLDocument');
class ServiceResolver extends AbstractResolver {
    static get resolverType() {
        return 'service';
    }
    static get telltale() {
        return 'url';
    }
    async resolve(definition) {
        const die = msg => {
            throw new Error(
                `Invalid arguments to ServiceResolver: ${inspect(definition, {
                    compact: false
                })}.\n\n${msg}`
            );
        };
        if (!definition.url) {
            die('No URL specified.');
        }
        if (!definition.query) {
            die('No GraphQL query document specified.');
        }
        debug('validated config %o', definition);
        const toResolve = [
            this.visitor.upward(definition, 'url'),
            this.visitor.upward(definition, 'query'),
            definition.method
                ? this.visitor.upward(definition, 'method')
                : 'POST',
            definition.headers
                ? this.visitor.upward(definition, 'headers')
                : {},
            definition.variables
                ? this.visitor.upward(definition, 'variables')
                : {}
        ];

        const [url, query, method, headers, variables] = await Promise.all(
            toResolve
        );

        if (variables && !isPlainObject(variables)) {
            die(`Variables must resolve to a plain object.`);
        }

        debug('url retrieved: "%s", query resolved, creating link', url);

        const link = new HttpLink({
            uri: url,
            fetch: this.visitor.io.networkFetch,
            headers,
            useGETForQueries: method === 'GET'
        });

        let parsedQuery;
        if (typeof query === 'string') {
            parsedQuery = new GraphQLDocument(query, this.visitor.io);
            await parsedQuery.compile();
        } else if (query instanceof GraphQLDocument) {
            parsedQuery = query;
        } else {
            throw new Error(`Unknown type passed to 'query'.`);
        }

        debug('running query with %o', variables);
        return makePromise(
            execute(link, { query: await parsedQuery.render(), variables })
        )
            .then(({ data, errors }) => {
                debug(
                    'query %s with %o resulted in %o',
                    definition.query,
                    variables,
                    { data, errors }
                );
                if (errors && errors.length > 0) {
                    throw new Error(errors[0].message);
                } else {
                    return { data };
                }
            })
            .catch(e => {
                if (
                    e.message.indexOf('Only absolute URLs are supported') !== -1
                ) {
                    throw new Error(url.toString() + 'invalid: ' + e.stack);
                }
                throw e;
            });
    }
}

module.exports = ServiceResolver;
