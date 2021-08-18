// TODO
class RootShimmerTypes {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._shimmer = venia.esModuleObject({
            module: '@magento/venia-ui/lib/RootComponents/Shimmer/types/index.js',
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
