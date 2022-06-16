/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    [`@magento/venia-ui/lib/components/ProductOptions/swatchList.js`]: '@orienteed/filterProductAttributesBasedOnAvailability/src/components/ProductOptions/swatchList.js',
    [`@magento/venia-ui/lib/components/ProductOptions/tileList.js`]: '@orienteed/filterProductAttributesBasedOnAvailability/src/components/ProductOptions/tileList.js',
    [`@magento/venia-ui/lib/components/ProductOptions/option.js`]: '@orienteed/filterProductAttributesBasedOnAvailability/src/components/ProductOptions/option.js',
    [`@magento/venia-ui/lib/components/ProductOptions/options.js`]: '@orienteed/filterProductAttributesBasedOnAvailability/src/components/ProductOptions/options.js'
};
