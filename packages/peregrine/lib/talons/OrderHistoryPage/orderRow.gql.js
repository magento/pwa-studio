import { gql } from '@apollo/client';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            id
            configurable_thumbnail_source @client
        }
    }
`;

export const GET_PRODUCT_THUMBNAILS_BY_URL_KEY = gql`
    query GetProductThumbnailsByURLKey($urlKeys: [String!]!) {
        products(filter: { url_key: { in: $urlKeys } }) {
            items {
                id
                sku
                thumbnail {
                    label
                    url
                }
                url_key
                url_suffix
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            sku
                            id
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
    getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS_BY_URL_KEY,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE
};
