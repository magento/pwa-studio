import { useStoreConfigContext } from '../../context/storeConfigProvider';

import { useCustomerWishlistSkus } from '../../hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';

export const useGallery = () => {
    useCustomerWishlistSkus();

        const { data: storeConfigData } = useStoreConfigContext();
    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        storeConfig
    };
};
