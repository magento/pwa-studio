const path = require('path');
const loader = require.resolve('./rendererCollectionLoader');

const renderersListPath = path.resolve(
    __dirname,
    '../components/RichContent/richContentRenderers.js'
);

/**
 * A registry of rich content renderering strategies used by the Venia
 * RichContent component. An instance of this class is made available when you
 * use VeniaUI's `richContentRenderers` target.
 */
class RichContentRendererList {
    /** @hideconstructor */
    constructor() {
        this._list = [];
        this.ident = this.constructor.name;
    }
    /**
     * Add a rendering strategy to the RichContent component.
     *
     * @param {Object} strategy - Describes the rich content renderer to include
     * @param {string} strategy.importPath - Import path to the RichContentRenderer module. Should be package-absolute.
     * @param {string} strategy.componentName - Name that will be given to the imported renderer in generated code. This is used for debugging purposes.
     */
    add(renderer) {
        if (
            typeof renderer.componentName !== 'string' ||
            !renderer.componentName ||
            typeof renderer.importPath !== 'string' ||
            !renderer.importPath
        ) {
            throw new Error(
                `richContentRenderers target: Argument is not a valid rich content renderer strategy. A valid strategy must have a JSX element name as "componentName" and a resolvable path to the renderer module as "importPath".`
            );
        }
        this._list.push(renderer);
    }
    /**
     * Inject the loader which generates the list of renderers as an array.
     * @ignore
     * @param {Object} module - Webpack Module of the renderers list.
     */
    inject(mod) {
        mod.loaders.push({
            ident: this.ident,
            loader,
            options: {
                renderers: this._list.reverse()
            }
        });
    }
    /**
     * Returns true if the provided module should have renderers injected.
     * Should be true for only one module per compilation!
     * @ignore
     * @param {Object} module - Webpack Module
     */
    shouldInject(mod) {
        return this._isRendererModule(mod) && !this._loaderIsInstalled(mod);
    }
    /** @ignore */
    _isRendererModule(mod) {
        return mod.resource === renderersListPath;
    }
    /** @ignore */
    _loaderIsInstalled(mod) {
        return mod.loaders.some(l => l.ident === this.ident);
    }
}

module.exports = RichContentRendererList;
