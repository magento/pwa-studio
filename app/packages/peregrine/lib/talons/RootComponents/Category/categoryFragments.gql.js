import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            uid
            ... on ConfigurableProduct {
                configurable_options {
                    attribute_code
                    attribute_id
                    uid
                    label
                    values {
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index

                        uid
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
                        code
                        value_index
                    }
                    product {
                        stock_status
                        uid
                        name
                        sku
                        description {
                            html
                        }
                        categories {
                            name
                        }
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
                    }
                }
            }
            name
            price_range {
                maximum_price {
                    regular_price {
                        currency
                        value
                    }
                }
            }
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
            sku
            small_image {
                url
            }
            stock_status

            rating_summary
            type_id
            __typename
            url_key
            url_suffix
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
