import { gql } from '@apollo/client';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            configurable_thumbnail_source
        }
    }
`;

export const GET_PRODUCT_THUMBNAILS_BY_URL_KEY = gql`
    query GetProductThumbnailsByURLKey($urlKeys: [String!]!) {
        products(filter: { url_key: { in: $urlKeys } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                sku
                thumbnail {
                    label
                    url
                }
                url_key
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableProduct {
                    variants {
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
    getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS_BY_URL_KEY,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE
};
