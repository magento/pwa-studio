const debug = require('debug')('upward-js:ServiceResolver');
const { inspect } = require('util');
const { execute, HttpLink } = require('@apollo/client');
const { isPlainObject } = require('lodash');
const AbstractResolver = require('./AbstractResolver');
const GraphQLDocument = require('../compiledResources/GraphQLDocument');

/**
 * Converts an observable into a promise.
 * A utility function that was previously exported by apollo-link.
 * See: https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link/src/linkUtils.ts#L39-L56
 * @param {*} observable
 */
function makePromise(observable) {
    let completed = false;
    return new Promise((resolve, reject) => {
        observable.subscribe({
            next: data => {
                if (completed) {
                    debug(
                        `Promise Wrapper does not support multiple results from Observable`
                    );
                } else {
                    completed = true;
                    resolve(data);
                }
            },
            error: reject
        });
    });
}

class ServiceResolver extends AbstractResolver {
    static get resolverType() {
        return 'service';
    }
    static get telltale() {
        return 'endpoint';
    }
    static recognize(definition) {
        // handle deprecated url property for now
        if (definition.hasOwnProperty('url')) {
            const newDefinition = Object.assign({}, definition, {
                endpoint: definition.url
            });
            delete newDefinition.url;
            return newDefinition;
        }
    }
    async resolve(definition) {
        const die = msg => {
            throw new Error(
                `Invalid arguments to ServiceResolver: ${inspect(definition, {
                    compact: false
                })}.\n\n${msg}`
            );
        };
        if (definition.endpoint && definition.url) {
            die(
                'Cannot specify both "url" and "endpoint" parameters. The "url" parameter is deprecated; use "endpoint" instead.'
            );
        }
        if (!definition.endpoint && !definition.url) {
            die('No endpoint specified.');
        }
        const endpointProp = definition.endpoint ? 'endpoint' : 'url';
        if (!definition.query) {
            die('No GraphQL query document specified.');
        }
        debug('validated config %o', definition);
        const toResolve = [
            this.visitor.upward(definition, endpointProp),
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

        const [endpoint, query, method, headers, variables] = await Promise.all(
            toResolve
        );

        if (variables && !isPlainObject(variables)) {
            die(`Variables must resolve to a plain object.`);
        }

        debug('url retrieved: "%s", query resolved, creating link', endpoint);

        const link = new HttpLink({
            uri: endpoint.toString(),
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
            .catch(async e => {
                const { print } = require('graphql/language/printer');
                throw new Error(
                    `ServiceResolver: Request to ${endpoint.toString()} failed: ${e}.\n\nQuery: ${print(
                        await parsedQuery.render()
                    )}\n\nVariables:\n\n ${JSON.stringify(variables)}`
                );
            });
    }
}

module.exports = ServiceResolver;
