const path = require('path');
const loader = require.resolve('./rendererCollectionLoader');

const isRCR = mod =>
    mod.resource ===
    path.resolve(
        __dirname,
        '../lib/components/RichContent/richContentRenderers.js'
    );

const loaderIdent = __filename;

const loaderIsInstalled = mod => mod.loaders.some(l => l.ident === loaderIdent);

const name = '@magento/venia-ui';

module.exports = api => {
    const richContentRenderers = api.getTarget('richContentRenderers');
    api.getTarget('@magento/pwa-buildpack', 'webpackCompiler').tap(
        name,
        compiler =>
            compiler.hooks.compilation.tap(name, compilation =>
                compilation.hooks.normalModuleLoader.tap(
                    name,
                    (loaderContext, mod) => {
                        if (isRCR(mod) && !loaderIsInstalled(mod)) {
                            const renderers = [];
                            const api = {
                                add(name, importString) {
                                    renderers.push([name, importString]);
                                }
                            };
                            richContentRenderers.call(api);
                            mod.loaders.push({
                                ident: __filename,
                                loader,
                                options: {
                                    renderers
                                }
                            });
                        }
                    }
                )
            )
    );
};
