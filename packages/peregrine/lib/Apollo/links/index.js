import MutationQueueLink from '@adobe/apollo-link-mutation-queue';
import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import getWithPath from 'lodash.get';
import setWithPath from 'lodash.set';

import MagentoGQLCacheLink from '@magento/peregrine/lib/Apollo/magentoGqlCacheLink';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import shrinkQuery from '@magento/peregrine/lib/util/shrinkQuery';

const isServer = !globalThis.document;
const storage = new BrowserPersistence();

/**
 * Intercept and shrink URLs from GET queries.
 *
 * Using GET makes it possible to use edge caching in Magento Cloud, but risks
 * exceeding URL limits with default usage of Apollo's http link.
 *
 * `shrinkQuery` encodes the URL in a more efficient way.
 *
 * @param {*} uri
 * @param {*} options
 */
const customFetchToShrinkQuery = (uri, options) => {
    // TODO: add `ismorphic-fetch` or equivalent to avoid this error
    if (typeof globalThis.fetch !== 'function') {
        console.error('This environment does not define `fetch`.');
        return () => {};
    }

    const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;

    return globalThis.fetch(resource, options);
};

const getLinks = apiBase => {
    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists.
        const token = storage.getItem('signin_token');

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });

    const storeLink = setContext((_, { headers }) => {
        const storeCurrency = storage.getItem('store_view_currency') || null;
        const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                store: storeCode,
                ...(storeCurrency && {
                    'Content-Currency': storeCurrency
                })
            }
        };
    });

    const errorLink = onError(handler => {
        const { graphQLErrors, networkError, response } = handler;

        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
            );
        }

        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
        }

        if (response) {
            const { data, errors } = response;
            let pathToCartItems;

            // It's within the GraphQL spec to receive data and errors, where
            // errors are merely informational and not intended to block. Almost
            // all existing components were not built with this in mind, so we
            // build special handling of this error message so we can deal with
            // it at the time we deem appropriate.
            errors.forEach(({ message, path }, index) => {
                if (
                    message === 'Some of the products are out of stock.' ||
                    message ===
                        'There are no source items with the in stock status' ||
                    message === 'The requested qty is not available'
                ) {
                    if (!pathToCartItems) {
                        pathToCartItems = path.slice(0, -1);
                    }

                    // Set the error to null to be cleaned up later
                    response.errors[index] = null;
                }
            });

            // indicator that we have some cleanup to perform on the response
            if (pathToCartItems) {
                const cartItems = getWithPath(data, pathToCartItems);
                const filteredCartItems = cartItems.filter(
                    cartItem => cartItem !== null
                );
                setWithPath(data, pathToCartItems, filteredCartItems);

                const filteredErrors = response.errors.filter(
                    error => error !== null
                );
                // If all errors were stock related and set to null, reset the error response so it doesn't throw
                response.errors = filteredErrors.length
                    ? filteredErrors
                    : undefined;
            }
        }
    });

    const retryLink = new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 5,
            retryIf: error => error && !isServer && navigator.onLine
        }
    });

    const gqlCacheLink = new MagentoGQLCacheLink();
    const mutationQueueLink = new MutationQueueLink();

    // Warning: `useGETForQueries` risks exceeding URL length limits.
    // These limits in practice are typically set at or behind where TLS
    // terminates. For Magento Cloud & Fastly, 8kb is the maximum by default.
    // https://docs.fastly.com/en/guides/resource-limits#request-and-response-limits
    const httpLink = createHttpLink({
        fetch: customFetchToShrinkQuery,
        useGETForQueries: true,
        uri: apiBase
    });

    // preserve this array order, it's important
    // as the terminating link, `httpLink` must be last
    const links = new Map()
        .set('MUTATION_QUEUE', mutationQueueLink)
        .set('RETRY', retryLink)
        .set('AUTH', authLink)
        .set('GQL_CACHE', gqlCacheLink)
        .set('STORE', storeLink)
        .set('ERROR', errorLink)
        .set('HTTP', httpLink);

    return links;
};

export default getLinks;
