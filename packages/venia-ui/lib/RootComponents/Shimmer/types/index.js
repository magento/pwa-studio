/**
 * This file is augmented at build time using the @magento/venia-ui build
 * target "rootShimmerTypes", which allows third-party modules to
 * add new root shimmer mappings for loading transitions.
 *
 * @see [Shimmer definition object]{@link RootShimmerTypesDefinition}
 */
export default {};

/**
 * A root shimmer definition object that describes a shimmer in your storefront.
 *
 * @typedef {Object} RootShimmerTypesDefinition
 * @property {string} shimmerType is use to map your shimmer
 * @property {string} importPath Resolvable path to the component the
 *   Root Shimmer component will render
 *
 * @example <caption>A custom root shimmer</caption>
 * const myCmsPageShimmer = {
 *      shimmerType: 'CMS_PAGE_SHIMMER',
 *      importPath: '@partner/module/path_to_your_component'
 * }
 */
