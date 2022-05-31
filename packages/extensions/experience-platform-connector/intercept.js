module.exports = targets => {

    // TODO: Remove these env variables once we are able to fetch the org and datastream id from graphql
    const builtins = targets.of('@magento/pwa-buildpack');
    builtins.envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'Experience Platform Connector',
            variables: [
                {
                    name: 'IMS_ORG_ID',
                    type: 'str',
                    desc: 'Value for imsOrgId context value',
                },
                {
                    name: 'DATASTREAM_ID',
                    type: 'str',
                    desc: 'Value for datastreamId context value',
                }
            ]
        });
    });

    const { talons } = targets.of('@magento/peregrine');
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');

    specialFeatures.tap(flags => {
        /**
         *  Wee need to activate esModules, cssModules and GQL Queries to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {
            esModules: true
        };
    });

    talons.tap(({ App }) => {
        App.useApp.wrapWith('@magento/experience-platform-connector');
    });
};
