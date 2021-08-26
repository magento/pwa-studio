/**
 * Implementation of our 'customContentTypes' target. This will gather
 * CustomContentType declarations { importPath, contentType } from all
 * interceptors, and then tap `builtins.transformModules` to inject a module
 * transform into the build which is configured to generate an array of modules
 * to be imported and then exported.
 *
 * An instance of this class is made available when you use Pagebuilder's
 * `customContentTypes` target.
 */
class CustomContentTypeList {
    /** @hideconstructor */
    constructor(pagebuilder) {
        const registry = this;
        this._types = pagebuilder.esModuleArray({
            module:
                '@magento/pagebuilder/lib/ContentTypes/customContentTypes.js',
            publish(targets) {
                targets.customContentTypes.call(registry);
            }
        });
    }
    /**
     * Add a rendering type to the Pagebuilder component.
     *
     * @param {Object} type - Describes the rich content type to include
     * @param {string} type.importPath - Import path to the CustomContentTypeRenderer module. Should be package-absolute.
     * @param {string} type.contentType - Name that will be given to the imported renderer in generated code. This is used for debugging purposes.
     */
    add(type) {
        if (
            typeof type.contentType !== 'string' ||
            !type.contentType ||
            typeof type.importPath !== 'string' ||
            !type.importPath
        ) {
            throw new Error(
                `customContentTypes target: Argument is not a valid rich content type.` +
                    ` A valid type must have a JSX element name as "contentType" and a resolvable path to the renderer module as "importPath".`
            );
        }
        const componentName = `${type.contentType}ContentType`;

        this._types.unshift(
            `import ${componentName} from '${type.importPath}';`
        );
    }
}

module.exports = CustomContentTypeList;
