export const useGalleryItem = (props = {}) => {
    const { item, storeConfig } = props;

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

    return { ...props, wishlistButtonProps };
};
