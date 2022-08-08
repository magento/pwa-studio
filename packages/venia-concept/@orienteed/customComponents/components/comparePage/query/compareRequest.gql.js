import { gql } from '@apollo/client';

export const GET_COMPARE_LIST_CUSTOMER = gql`
   # Write your query or mutation here
 query getCustomerCompareList {
        customer {
            compare_list {
                item_count
                uid
                items {
                    uid
                    __typename

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
                        __typename
                        uid
                        price_range {
                            __typename
                            maximum_price {
                                final_price {
                                    value
                                }
                              regular_price{
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
                        __typename
                    }
                }
            }
        }
    }
`;
export const GET_COMPARE_LIST = gql`
    query getCompareList($uid: [ID!]) {
        compareList(uid: $uid) {
            item_count
            uid
            items {
                uid
                __typename

                product {
                    name
                    small_image {
                        url
                    }
                    url_suffix
                    uid
                    price_range {
                        __typename
                        maximum_price {
                            final_price {
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
                    __typename
                }
            }
        }
    }
`;
export const CREATE_COMPARE_LIST = gql`
    mutation createCompareProductList($products: [ID!]) {
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

export const ASSGIN_COMPARE_TO_CUSTOMER = gql`
    mutation assginListToCustomer($uid: ID!) {
        assignCompareListToCustomer(uid: $uid) {
            result
            compare_list {
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
                        name
                        description {
                            html
                        }
                    }
                }
            }
        }
    }
`;

export const DELETE_PRODUCTS_FROM_LIST = gql`
    mutation deleteProductsFromList($uid: ID!, $products: [ID]!) {
        removeProductsFromCompareList(
            input: { uid: $uid, products: $products }
        ) {
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

export const DELETE_COMPARE_LIST = gql`
    mutation deleteCompareProducts($uid: ID!) {
        deleteCompareList(uid: $uid) {
            result
        }
    }
`;
