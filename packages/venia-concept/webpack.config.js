const { configureWebpack } = require('@magento/pwa-buildpack');

module.exports = async env => {
    const config = await configureWebpack({
        context: __dirname,
        vendor: [
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
            'informed',
            'react',
            'react-apollo',
            'react-dom',
            'react-feather',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk'
        ],
        special: {
            '@magento/peregrine': {
                esModules: true,
                cssModules: true
            }
            // '@magento/venia-library': {
            //     cssModules: true,
            //     esModules: true,
            //     graphQLQueries: true,
            //     rootComponents: true,
            //     upward: true
            // }
        },
        env
    });

    config.module.noParse = [/braintree\-web\-drop\-in/];

    return config;
};
