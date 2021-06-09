import { useQuery } from '@apollo/client';

import { useCustomerWishlistSkus } from '../../hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';

import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './gallery.gql';

export const useGallery = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    useCustomerWishlistSkus();

    const { data: wishlistConfigData } = useQuery(
        operations.getWishlistConfigQuery,
        { fetchPolicy: 'cache-and-network' }
    );

    const storeConfig = wishlistConfigData
        ? wishlistConfigData.storeConfig
        : null;

    return {
        storeConfig
    };
};
