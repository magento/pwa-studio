/**
 * Implementation of our 'CategoryListProductAttributes' target. This will gather
 * CategoryListProductAttributes declarations { matcher, importStatement } from all
 * interceptors, and then tap `builtins.transformModules` to inject a module
 * transform into the build which is configured to append components to the element
 * specified by the matcher.
 *
 * An instance of this class is made available when you use VeniaUI's
 * `categoryListProductAttributes` target.
 *
 * The CategoryListProductAttributes declarations collected as part of this target will be
 * used to render the gallery item component in category lists.
 */
class CategoryListProductAttributes {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._component = venia.reactComponent({
            module: '@magento/venia-ui/lib/components/Gallery/item.js',
            publish(targets) {
                targets.categoryListProductAttributes.call(registry);
            }
        });
    }

    insertAfterJSX({ matcher, importStatement }) {
        const ProductAttributeComponent = this._component.addImport(
            importStatement
        );
        this._component.insertAfterJSX(
            matcher,
            `<${ProductAttributeComponent} item={props.item} />`
        );
    }
}

module.exports = CategoryListProductAttributes;
