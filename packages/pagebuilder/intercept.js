const myName = '@magento/pagebuilder';
module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    builtins.specialFeatures.tap(featuresByModule => {
        featuresByModule[myName] = {
            esModules: true,
            cssModules: true
        };
    });
    builtins.envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'PageBuilder',
            variables: [
                {
                    name: 'GOOGLE_MAPS_API_KEY',
                    type: 'str',
                    desc:
                        'Specify a Google Maps API token for instantiating a Maps instance for your Page Builder map content type.',
                    default: ''
                }
            ]
        });
    });

    targets
        .of('@magento/venia-ui')
        .richContentRenderers.tap(richContentRenderers => {
            richContentRenderers.add({
                componentName: 'PageBuilder',
                packageName: myName
            });
        });
};
