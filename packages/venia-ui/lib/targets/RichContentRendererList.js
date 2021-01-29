/**
 * Implementation of our 'richContentRenderers' target. This will gather
 * RichContentRenderer declarations { importPath, componentName } from all
 * interceptors, and then tap `builtins.transformModules` to inject a module
 * transform into the build which is configured to generate an array of modules
 * to be imported and then exported.
 *
 * An instance of this class is made available when you use VeniaUI's
 * `richContentRenderers` target.
 */
class RichContentRendererList {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._renderers = venia.esModuleArray({
            module:
                '@magento/venia-ui/lib/components/RichContent/richContentRenderers.js',
            publish(targets) {
                targets.richContentRenderers.call(registry);
            }
        });
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
        this._renderers.unshift(
            `import * as ${renderer.componentName} from '${
                renderer.importPath
            }';`
        );
    }
}

module.exports = RichContentRendererList;
