import { gql } from '@apollo/client';

export const DISPLAY_COUNT = 4;

export const GET_PRODUCT_THUMBNAILS_BY_SKU = gql`
    query GetProductThumbnailsBySku($pageSize: Int = ${DISPLAY_COUNT}, $skus: [String!]!) {
        products(filter: { sku: { in: $skus } }, pageSize: $pageSize) {
            items {
                id
                thumbnail {
                    label
                    url
                }
            }
        }
    }
`;

export default {
    queries: {
        getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS_BY_SKU
    }
};
