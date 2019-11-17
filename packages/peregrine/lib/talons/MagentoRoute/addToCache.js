const addToCache = async (...urls) => {
    if (!window.caches) {
        throw new Error(
            'Current environment does not support CacheStorage at window.caches.'
        );
    }

    const cache = await window.caches.open(
        `workbox-runtime-${location.origin}/`
    );

    await cache.addAll(urls);
};

export default addToCache;
