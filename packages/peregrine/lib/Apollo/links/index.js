import { createHttpLink } from '@apollo/client';

import createAuthLink from '@magento/peregrine/lib/Apollo/links/authLink';
import createErrorLink from '@magento/peregrine/lib/Apollo/links/errorLink';
import createGqlCacheLink from '@magento/peregrine/lib/Apollo/links/gqlCacheLink';
import createMutationQueueLink from '@magento/peregrine/lib/Apollo/links/mutationQueueLink';
import createRetryLink from '@magento/peregrine/lib/Apollo/links/retryLink';
import createStoreLink from '@magento/peregrine/lib/Apollo/links/storeLink';
import shrinkQuery from '@magento/peregrine/lib/util/shrinkQuery';

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
export const customFetchToShrinkQuery = (uri, options) => {
    // TODO: add `ismorphic-fetch` or equivalent to avoid this error
    if (typeof globalThis.fetch !== 'function') {
        console.error('This environment does not define `fetch`.');
        return () => {};
    }

    const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;

    return globalThis.fetch(resource, options);
};

const getLinks = apiBase => {
    const authLink = createAuthLink();
    const storeLink = createStoreLink();
    const errorLink = createErrorLink();
    const retryLink = createRetryLink();
    const gqlCacheLink = createGqlCacheLink();
    const mutationQueueLink = createMutationQueueLink();

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
