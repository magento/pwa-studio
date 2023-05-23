import { gql } from '@apollo/client';

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        product {
            uid
            orParentSku
            image {
                label
                url
            }
            name
            price {
                regularPrice {
                    amount {
                        currency
                        value
                    }
                }
                minimalPrice {
                    amount {
                        currency
                        value
                    }
                }
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
            sku
            stock_status
            url_key
            url_suffix
            ... on ConfigurableProduct {
                variants {
                    attributes {
                        uid
                        code
                        value_index
                        label
                    }
                    product {
                        stock_status
                        id
                        uid
                        small_image {
                            url
                        }
                        thumbnail {
                            url
                        }
                    }
                }
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
            }
            ... on SimpleProduct {
                custom_attributes {
                    selected_attribute_options {
                        attribute_option {
                            label
                        }
                    }
                }
            }
        }
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
