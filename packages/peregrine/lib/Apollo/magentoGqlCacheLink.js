import { ApolloLink } from '@apollo/client';

const CACHE_ID_HEADER = 'X-Magento-Cache-Id';

export default class MagentoGQLCacheLink extends ApolloLink {
    // Our very first request won't have a cache id.
    #cacheId = null;

    request(operation, forward) {
        // Attach the cache header to each outgoing request.
        operation.setContext(previousContext => {
            const { headers } = previousContext;
            const withCacheHeader = {
                ...headers,
                [CACHE_ID_HEADER]: this.#cacheId
            };

            console.log('sending out', this.#cacheId);

            return {
                ...previousContext,
                headers: withCacheHeader
            };
        });

        // Update the cache id with each response.
        const updateCacheId = data => {
            this.#cacheId = Math.random();

            console.log('received', this.#cacheId);

            // Purposefully don't modify the result,
            // no other link needs to know about the cache id.
            return data;
        };

        return forward(operation).map(updateCacheId);
    }
}
