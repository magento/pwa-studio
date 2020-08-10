/**
 * @module VeniaUI/Targets
 */
const RichContentRendererList = require('./RichContentRendererList');

/**
 * TODO: This code intercepts the Webpack module for a specific file in this
 * package. That will be a common enough pattern that it should be turned into
 * a utility function.
 */

const name = '@magento/venia-ui';

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(featuresByModule => {
        featuresByModule['@magento/venia-ui'] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true,
            rootComponents: true,
            upward: true
        };
    });

    builtins.webpackCompiler.tap(compiler =>
        compiler.hooks.compilation.tap(name, compilation => {
            const renderers = new RichContentRendererList();
            compilation.hooks.normalModuleLoader.tap(
                `${name}:RichContentRendererInjector`,
                (loaderContext, mod) => {
                    if (renderers.shouldInject(mod)) {
                        targets.own.richContentRenderers.call(renderers);
                        renderers.inject(mod);
                    }
                }
            );
        })
    );

    // Dogfood our own richContentRenderer hook to insert the fallback renderer.
    targets.own.richContentRenderers.tap(rendererInjector =>
        rendererInjector.add({
            componentName: 'PlainHtmlRenderer',
            importPath: './plainHtmlRenderer'
        })
    );

    /**
     * Implementation of our `routes` target. When Buildpack runs
     * `transformModules`, this interceptor will provide a nice API to
     * consumers of `routes`: instead of specifying the transform file
     * and the path to the routes component, you can just push route
     * requests into a neat little array.
     */
    builtins.transformModules.tap(addTransform => {
        addTransform({
            type: 'babel',
            fileToTransform:
                '@magento/venia-ui/lib/components/Routes/routes.js',
            transformModule:
                '@magento/venia-ui/lib/targets/BabelRouteInjectionPlugin',
            options: {
                routes: targets.own.routes.call([])
            }
        });
    });

    targets.own.routes.tap(routes => [
        ...routes,
        {
            name: 'Cart',
            pattern: '/cart',
            exact: true,
            path: '../CartPage'
        },
        {
            name: 'Search',
            pattern: '/search.html',
            exact: true,
            path: '../../RootComponents/Search'
        },
        {
            name: 'CreateAccountPage',
            pattern: '/create-account',
            exact: true,
            path: '../CreateAccountPage'
        },
        {
            name: 'CheckoutPage',
            pattern: '/checkout',
            exact: true,
            path: '../CheckoutPage'
        }
    ]);
};
