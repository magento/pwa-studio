const { useEffect } = require('react');

module.exports = original => props => {
    useEffect(() => {
        import(/* webpackChunkName: "acdl" */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        '@adobe/adobe-client-data-layer');
    }, []);

    return original(props);
};
