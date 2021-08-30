import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';

export const useGalleryItem = (props = {}) => {
    const { item, storeConfig } = props;

    const productType = item ? item.__typename : null;

    const isSupportedProductType = isSupported(productType);

    const wishlistButtonProps =
        storeConfig && storeConfig.magento_wishlist_general_is_enabled === '1'
            ? {
                  item: {
                      sku: item.sku,
                      quantity: 1
                  },
                  storeConfig
              }
            : null;

    return { ...props, wishlistButtonProps, isSupportedProductType };
};
