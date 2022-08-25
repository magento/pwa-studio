/**
 * Create a Webpack configuration object customized for your project.
 * @module Buildpack/WebpackTools
 */
const path = require('path');
const pkgDir = require('pkg-dir');

/**
 * Boolean flags indicating that a dependent package has special capabilities
 * requiring Webpack to process its modules differently.
 * @typedef {Object} Buildpack/WebpackTools~SpecialBuildFlags
 * @property {boolean} [cssModules] Parse `.css` files as CSS Modules
 * @property {boolean} [esModules] Parse JS files as ECMAScript Modules
 * @property {boolean} [graphqlQueries] Transpile and inline .graphql files
 * @property {boolean} [rootComponents] Look for RootComponents to handle
 *   Magento page types
 * @property {boolean} [upward] Look for `upward.yml` files to be merged into
 *   the final UPWARD config
 * @property {boolean} [i18n] Parse i18n/*.json language pack files
 */

/**
 * For any flag in {@link SpecialBuildFlags}, return a list of real paths to
 * modules which declared that flag to be `true` before or during build.
 * @callback Buildpack/WebpackTools~hasSpecialFlags
 * @param {string} flag - Special flag the returned dependencies must have
 * @returns {string[]} realpaths - Real paths to the root directories of the modules which have set that flag.
 */

/**
 *
 * @param {Object<string,SpecialBuildFlags>} [special={}] - Map of module names
 *   to special flags manually declared by build configuration.
 * @param {BuildBus} bus - {@link BuildBus} for the currently running task.
 *   Will be used to call the `specialFeatures` target.
 * @param {Buildpack/WebpackTools~MagentoResolver} resolver - Enhanced resolver
 * @returns {hasSpecialFlags}
 */
async function getSpecialFlags(special = {}, bus, resolver) {
    bus.getTargetsOf('@magento/pwa-buildpack').specialFeatures.call(special);

    // Resolve every module listed in the `special` object into an absolute
    // filesystem path. Will be used as a test for the loader rules for each
    // of these feature flags.
    const features = await Promise.all(
        Object.entries(special).map(async ([packageName, flags]) => [
            packageName,
            await pkgDir(path.dirname(await resolver.resolve(packageName))),
            flags
        ])
    );

    return flag =>
        features.reduce(
            (hasIt, [, packagePath, flags]) =>
                flags[flag] ? [...hasIt, packagePath] : hasIt,
            []
        );
}

module.exports = getSpecialFlags;
