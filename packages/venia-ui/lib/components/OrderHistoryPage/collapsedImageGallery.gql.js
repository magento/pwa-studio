import { gql } from '@apollo/client';

export const GET_PRODUCT_THUMBNAILS_BY_SKU = gql`
    query GetProductThumbnailsBySku($imageCount: Int!, $skus: [String!]!) {
        products(filter: { sku: { in: $skus } }, pageSize: $imageCount) {
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
