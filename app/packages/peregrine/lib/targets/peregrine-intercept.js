const path = require('path');
const HookInterceptorSet = require('./HookInterceptorSet');

const packageDir = path.resolve(__dirname, '../../');

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(featuresByModule => {
        featuresByModule['@magento/peregrine'] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true
        };
    });

    /**
     * Tap the low-level Buildpack target for wrapping _any_ frontend module.
     * Wrap the config object in a HookInterceptorSet, which presents
     * higher-level targets for named and namespaced hooks, instead of the file
     * paths directly. Pass that higher-level config through `talons` and
     * `hooks` interceptors, so they can add wrappers for the hook modules
     * without tapping the `transformModules` config themselves.
     */
    const publicHookSets = ['hooks', 'talons'];
    // Waits to build API until `transformModules` target runs.
    builtins.transformModules.tapPromise(async addTransform => {
        await Promise.all(
            // Run the same setup routine for "hooks" and "talons"
            publicHookSets.map(async name => {
                const hookInterceptors = new HookInterceptorSet(
                    path.resolve(packageDir, 'lib', name),
                    targets.own[name]
                );
                // Run any bound interceptors!
                await hookInterceptors.runAll();
                // Get out the generated transformModules and add each one.
                hookInterceptors.allModules.forEach(targetable =>
                    targetable.flush().forEach(addTransform)
                );
            })
        );
    });
};
