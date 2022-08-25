const myName = '@magento/pagebuilder';
const { Targetables } = require('@magento/pwa-buildpack');
const CustomContentTypeList = require('./ContentTypes/CustomContentTypeList');
module.exports = targets => {
    const pagebuilder = Targetables.using(targets);
    pagebuilder.setSpecialFeatures('esModules', 'cssModules');
    pagebuilder.defineEnvVars('PageBuilder', [
        {
            name: 'GOOGLE_MAPS_API_KEY',
            type: 'str',
            desc:
                'Specify a Google Maps API token for instantiating a Maps instance for your Page Builder map content type.',
            default: ''
        }
    ]);

    targets
        .of('@magento/venia-ui')
        .richContentRenderers.tap(richContentRenderers => {
            richContentRenderers.add({
                componentName: 'PageBuilder',
                importPath: myName
            });
        });

    new CustomContentTypeList(pagebuilder);
};
