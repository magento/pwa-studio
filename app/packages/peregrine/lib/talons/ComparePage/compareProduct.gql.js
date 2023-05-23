import { gql } from '@apollo/client';

export const CREATE_COMPARE_LIST = gql`
    mutation CreateCompareList($products: [ID!]) {
        createCompareList(input: { products: $products }) {
            uid
            item_count
            attributes {
                code
                label
            }
            items {
                uid
                product {
                    sku
                    uid
                    name
                    description {
                        html
                    }
                }
            }
        }
    }
`;

export const DELETE_PRODUCTS_FROM_COMPARE_LIST = gql`
    mutation DeleteProductsFromCompareList($uid: ID!, $products: [ID]!) {
        removeProductsFromCompareList(input: { uid: $uid, products: $products }) {
            uid
            item_count
            attributes {
                code
                label
            }
            items {
                uid
                product {
                    uid
                    sku
                    name
                    description {
                        html
                    }
                }
            }
        }
    }
`;

export const GET_CUSTOMER_COMPARE_LIST = gql`
    query GetCustomerCompareList {
        customer {
            compare_list {
                item_count
                uid
                items {
                    uid
                    attributes {
                        value
                        code
                    }
                    product {
                        name
                        small_image {
                            url
                        }
                        url_suffix
                        stock_status
                        url_key
                        uid
                        price_range {
                            maximum_price {
                                final_price {
                                    value
                                }
                                regular_price {
                                    currency
                                    value
                                }
                            }
                            minimum_price {
                                regular_price {
                                    value
                                    currency
                                }
                                final_price {
                                    value
                                    currency
                                }
                            }
                        }
                        description {
                            html
                        }
                        sku
                    }
                }
            }
        }
    }
`;

export default {
    createCompareListMutation: CREATE_COMPARE_LIST,
    deleteProductsFromCompareListMutation: DELETE_PRODUCTS_FROM_COMPARE_LIST,
    getCustomerCompareListQuery: GET_CUSTOMER_COMPARE_LIST
};
