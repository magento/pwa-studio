/**
 * This file describes PWA Studio to Magento version compatibilities.
 */

// PWA Studio version -> Magento version.
module.exports = {
    '14.0.1': '2.4.7-beta3',
    '14.0.0': '2.4.7-beta3',
    '13.3.0': '2.4.7-beta2',
    '13.2.0': '2.4.7-beta1',
    '13.1.0': '2.4.6',
    '13.0.0': '2.4.5',
    '12.7.0': '2.4.5',
    '12.6.0': '2.4.5',
    '12.5.0': '2.4.4',
    '12.4.0': '2.4.4',
    '12.3.0': '2.4.3',
    '12.2.0': '2.4.3',
    '12.1.0': '2.4.3',
    '12.0.0': '2.4.3',
    '11.0.0': '2.4.3',
    '10.0.0': '2.4.2',
    '9.0.1': '2.4.2',
    '9.0.0': '2.4.2',
    '8.0.0': '2.4.0 - 2.4.1',
    '7.0.0': '2.3.5 - 2.4.0',
    '6.0.1': '2.3.4 - 2.3.5',
    '6.0.0': '2.3.4 - 2.3.5',
    '5.0.1': '2.3.3 - 2.3.4',
    '5.0.0': '2.3.3 - 2.3.4',
    '4.0.0': '2.3.2 - 2.3.3',
    '3.0.0': '2.3.1 - 2.3.2',
    '2.1.0': '2.3.1',
    '2.0.0': '2.3.0'
};

// Magento version compatibility
var magentoVersion = '2.4.3';

// React version compatibility
var reactVersion = '17.0.2';

// Fornt End dependencies
var forntEndDependencies = {
    '@magento/experience-platform-connector': '~1.0.7',
    '@magento/venia-data-collector': '~1.0.7',
    '@magento/pagebuilder': '~9.3.1',
    '@magento/peregrine': '~14.3.1',
    '@magento/pwa-theme-venia': '~2.4.0',
    '@magento/upward-security-headers': '~1.0.14',
    '@magento/venia-ui': '~11.4.0',
    '@magento/venia-product-recommendations': '~1.0.1',
    '@magento/recommendations-js-sdk': '~2.0.6',
    '@adobe/magento-storefront-events-sdk': '~1.9.0',
    '@magento/pwa-buildpack': '~11.5.3',
    '@magento/venia-sample-language-packs': '~0.0.16',
    '@magento/upward-js': '5.4.2',
    '@magento/upward-spec': '5.3.1',
    '@magento/venia-concept': '14.0.1',
    '@magento/venia-sample-backends': '0.0.11',
    '@magento/venia-sample-eventing': '0.0.8'
};

// Back End dependencies
var backEndDependencies = {
    'magento/module-data-services-graphql': '^1.2',
    'magento/module-experience-connector-graphql': '^1.1',
    'magento/module-page-builder-product-recommendations': '^2.0',
    'magento/module-upward-connector': '^2.0.4',
    'magento/module-visual-product-recommendations': '^2.0',
    'magento/product-enterprise-edition': '^2.4.7-p1',
    'magento/product-recommendations': '^6.0',
    'magento/pwa': '^0.7.2',
    'magento/pwa-commerce': '^0.0.4',
    'magento/venia-sample-data': '^0.0.5'
};
