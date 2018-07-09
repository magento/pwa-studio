const trailingSlashRE = /\/+$/;
const wrappingSlashRE = /^\/*(.+?)\/*$/;
export function makePathPrepender(prefix) {
    const normalizedPrefix = prefix.replace(trailingSlashRE, '') + '/';
    return (...args) => {
        return (
            normalizedPrefix +
            args.map(p => p.replace(wrappingSlashRE, '$1')).join('/')
        );
    };
}

const ProductMediaPath =
    process.env.MAGENTO_BACKEND_PRODUCT_MEDIA_PATH || '/media/catalog/product/';
export const makeProductMediaPath = makePathPrepender(ProductMediaPath);
