/**
 * Implementation of our 'RootShimmerTypes' target. This will gather
 * RootShimmerTypes declarations { shimmerType, importPath } from all
 * interceptors, and then inject them into the shimmer types export
 *
 * An instance of this class is made available when you use VeniaUI's
 * `rootShimmerTypes` target.
 *
 * The RootShimmerTypes declarations collected as part of this target will be
 * used to render the appropriate root shimmer component during page transition
 * when using the useInternalLink hook.
 */
class RootShimmerTypes {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._shimmer = venia.esModuleObject({
            module:
                '@magento/venia-ui/lib/RootComponents/Shimmer/types/index.js',
            publish(targets) {
                targets.rootShimmerTypes.call(registry);
            }
        });
    }

    add({ shimmerType, importPath }) {
        this._shimmer.add(`import ${shimmerType} from '${importPath}'`);
    }
}

module.exports = RootShimmerTypes;
