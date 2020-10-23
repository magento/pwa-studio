/**
 * @module VeniaUI/Targets
 */
const { Targetables } = require('@magento/pwa-buildpack');
const RichContentRendererList = require('./RichContentRendererList');
const makeRoutesTarget = require('./makeRoutesTarget');
const makePaymentTarget = require('./makePaymentTarget');

module.exports = veniaTargets => {
    const venia = Targetables.using(veniaTargets);

    venia.setSpecialFeatures(
        'cssModules',
        'esModules',
        'graphqlQueries',
        'rootComponents',
        'upward',
        'i18n'
    );

    makeRoutesTarget(venia);
    makePaymentTarget(venia);

    const renderers = new RichContentRendererList(venia);

    renderers.add({
        componentName: 'PlainHtmlRenderer',
        importPath: './plainHtmlRenderer'
    });
};
