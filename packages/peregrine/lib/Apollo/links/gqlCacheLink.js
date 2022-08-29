import { ApolloLink } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

// The name of the header to exchange with the server.
const CACHE_ID_HEADER = 'x-magento-cache-id';
// The key in local storage where we save the cache id
const LOCAL_STORAGE_KEY = 'magento_cache_id';
const storage = new BrowserPersistence();

/**
 * The Magento GraphQL Cache Link class is an ApolloLink that is responsible for
 * Venia sending the proper `x-magento-cache-id` header with each of its GraphQL requests.
 */
export class MagentoGQLCacheLink extends ApolloLink {
    // The links get reinstantiated on refresh.
    // If we have an existing cache id value from a previous browsing session, use it.
    #cacheId = storage.getItem(LOCAL_STORAGE_KEY) || null;

    // Any time the cache id needs to be set, update both our internal variable and
    // the value in local storage.
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

        // Update the cache id from each response.
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

export default function createGqlCacheLink() {
    return new MagentoGQLCacheLink();
}
