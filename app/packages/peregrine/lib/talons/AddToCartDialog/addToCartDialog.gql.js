import { gql } from '@apollo/client';

const GET_PRODUCT_DETAIL_FOR_ATC_DIALOG_BY_SKU = gql`
    query GetProductDetailForATCDialogBySku($sku: String!, $configurableOptionValues: [ID!]) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                uid
                image {
                    label
                    url
                }
                price_range {
                    maximum_price {
                        final_price {
                            currency
                            value
                        }

                        discount {
                            amount_off
                        }
                    }
                }
                ... on ConfigurableProduct {
                    configurable_options {
                        uid
                        attribute_uid
                        label
                        position
                        values {
                            label
                            uid
                        }
                    }
                    configurable_product_options_selection(configurableOptionValueUids: $configurableOptionValues) {
                        media_gallery {
                            label
                            url
                        }
                        variant {
                            id
                            uid
                            price_range {
                                maximum_price {
                                    final_price {
                                        currency
                                        value
                                    }

                                    discount {
                                        amount_off
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
    getProductDetailQuery: GET_PRODUCT_DETAIL_FOR_ATC_DIALOG_BY_SKU
};
