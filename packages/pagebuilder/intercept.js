const myName = '@magento/pagebuilder';
module.exports = targets => {
    targets
        .of('@magento/pwa-buildpack')
        .specialFeatures.tap(featuresByModule => {
            featuresByModule[myName] = {
                esModules: true,
                cssModules: true
            };
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
