import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

export const useCollapsedImageGallery = props => {
    const { items, queries } = props;
    const { getProductThumbnailsQuery } = queries;

    const productSkus = useMemo(() => {
        return items.map(item => item.product_sku);
    }, [items]);

    const { data } = useQuery(getProductThumbnailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            skus: productSkus
        }
    });

    return {
        imageData: data
    };
};
