module.exports = api => {
    api.getTarget('@magento/pwa-buildpack', 'specialFeatures').tap(
        '@magento/pagebuilder',
        featuresByModule => {
            featuresByModule['@magento/pagebuilder'] = {
                esModules: true,
                cssModules: true
            };
        }
    );
    api.getTarget('@magento/venia-ui', 'richContentRenderers').tap(
        '@magento/pagebuilder',
        richContentRenderers => {
            richContentRenderers.add({
                componentName: 'PageBuilder',
                packageName: '@magento/pagebuilder'
            });
        }
    );
};
