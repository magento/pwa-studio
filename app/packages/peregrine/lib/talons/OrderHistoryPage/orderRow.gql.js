import { gql } from '@apollo/client';

export const GET_PRODUCT_THUMBNAILS_BY_URL_KEY = gql`
    query GetProductThumbnailsByUrlKey($urlKeys: [String!]!) {
        products(filter: { url_key: { in: $urlKeys } }) {
            items {
                uid
                sku
                thumbnail {
                    label
                    url
                }
                url_key
                ... on ConfigurableProduct {
                    variants {
                        product {
                            sku
                            uid
                            thumbnail {
                                label
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS_BY_URL_KEY
};
