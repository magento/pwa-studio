import { gql } from '@apollo/client';
export const GET_SIMPLE_PRODUCT = gql`
    query getSimpleProduct($sku: String!) {
        products(search: $sku, filter: { sku: { eq: $sku } }) {
            items {
                mp_attachments {
                    file_icon
                    file_label
                    file_name
                    file_size
                    group {
                        name
                        position
                        value
                    }
                    note
                    url_file
                    __typename
                }
                name
                media_gallery_entries {
                    file
                    disabled
                    uid
                    label
                    position
                }
                categories {
                    breadcrumbs {
                        category_uid
                    }
                    uid
                }
                sku
                orParentSku
                description {
                    html
                }
                id
                uid
                stock_status
                image {
                    label
                    url
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
                price_range {
                    maximum_price {
                        final_price {
                            currency
                            value
                        }
                    }
                }
            }
            aggregations {
                label
                options {
                    count
                    label
                    value
                }
            }
        }
    }
`;
