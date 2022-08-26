import { gql } from '@apollo/client';

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        product {
            uid
            image {
                label
                url
            }
            name
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
            sku
            stock_status
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ConfigurableProduct {
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                configurable_options {
                    uid
                    attribute_code
                    attribute_id
                    attribute_id_v2
                    label
                    values {
                        uid
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
                variants {
                    attributes {
                        uid
                        code
                        value_index
                    }
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    product {
                        uid
                        stock_status
                        small_image {
                            url
                        }
                    }
                }
            }
        }
        # TODO: Use configurable_product_option_uid for ConfigurableWishlistItem when available in 2.4.5
        ... on ConfigurableWishlistItem {
            configurable_options {
                id
                option_label
                value_id
                value_label
            }
        }
    }
`;
