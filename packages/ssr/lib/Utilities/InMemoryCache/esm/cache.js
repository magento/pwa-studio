import { InMemoryCache } from '@apollo/client';

function createCache() {
    return new InMemoryCache();
}

export default { createCache, InMemoryCache };
