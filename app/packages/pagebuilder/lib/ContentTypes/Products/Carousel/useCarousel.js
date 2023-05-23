import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';
import { useCustomerWishlistSkus } from '@magento/peregrine/lib/hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';

/**
 * This is a duplicate of @magento/peregrine/lib/talons/Gallery/useGallery.js
 */
export const useCarousel = () => {
        const { data: storeConfigData } = useStoreConfigContext();

    useCustomerWishlistSkus();

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        storeConfig
    };
};
