import { useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './gallery.gql';

export const useGallery = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

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
