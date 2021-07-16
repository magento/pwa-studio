import { ApolloLink } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const CACHE_ID_HEADER = 'x-magento-cache-id';
const LOCAL_STORAGE_KEY = 'magento_cache_id';
const storage = new BrowserPersistence();

export default class MagentoGQLCacheLink extends ApolloLink {
    // The links get reinstantiated on refresh.
    // If we have an existing cache id value from a previous browsing session, use that.
    #cacheId = storage.getItem(LOCAL_STORAGE_KEY) || null;

    setCacheId(value) {
        this.#cacheId = value;
        storage.setItem(LOCAL_STORAGE_KEY, value);
    }

    request(operation, forward) {
        // Attach the cache header to each outgoing request.
        operation.setContext(previousContext => {
            const { headers } = previousContext;
            const withCacheHeader = {
                ...headers,
                [CACHE_ID_HEADER]: this.#cacheId
            };

            return {
                ...previousContext,
                headers: withCacheHeader
            };
        });

        // Update the cache id with each response.
        const updateCacheId = data => {
            const context = operation.getContext();
            const { response } = context;

            const responseCacheId = response.headers.get(CACHE_ID_HEADER);

            if (responseCacheId) {
                this.setCacheId(responseCacheId);
            }

            // Purposefully don't modify the result,
            // no other link needs to know about the cache id.
            return data;
        };

        return forward(operation).map(updateCacheId);
    }
}
