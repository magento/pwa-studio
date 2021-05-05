import { gql } from '@apollo/client';

const GET_PRODUCT_DETAIL = gql`
    query GetProductDetailForATCDialog(
        $sku: String!
        $configurableOptionValues: [ID!]
    ) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                uid
                image {
                    label
                    url
                }
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_uid
                        label
                        position
                        values {
                            label
                            uid
                        }
                    }
                    configurable_product_options_selection(
                        configurableOptionValueUids: $configurableOptionValues
                    ) {
                        media_gallery {
                            label
                            url
                        }
                        variant {
                            uid
                            price_range {
                                maximum_price {
                                    final_price {
                                        currency
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getProductDetailQuery: GET_PRODUCT_DETAIL
};
