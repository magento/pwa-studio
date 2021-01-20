const { useEffect } = require('react');

module.exports = original => props => {
    // define the global as soon as possible
    globalThis.adobeDataLayer = globalThis.adobeDataLayer || [];
    useEffect(() => {
        // import the library as late as possible
        import(/* webpackChunkName: "acdl" */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        '@adobe/adobe-client-data-layer');
    }, []);

    return original(props);
};
