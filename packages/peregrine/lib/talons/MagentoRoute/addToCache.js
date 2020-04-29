const addToCache = async (...urls) => {
    if (!window.caches) {
        throw new Error(
            'Current environment does not support CacheStorage at window.caches.'
        );
    }

    /**
     * TODO - Should take cache name from defaults
     */
    const cache = await window.caches.open('workbox-runtime');

    await cache.addAll(urls);
};

export default addToCache;
