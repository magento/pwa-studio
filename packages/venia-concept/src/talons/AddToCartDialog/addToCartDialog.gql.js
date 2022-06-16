import { gql } from '@apollo/client';
import { CartTriggerFragment } from '@magento/peregrine/lib/talons/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';

const GET_PRODUCT_DETAIL = gql`
    query GetProductDetailForATCDialog($sku: String!, $configurableOptionValues: [ID!]) {
        products(filter: { sku: { eq: $sku } }) {
            items {
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
                ... on ConfigurableProduct {
                    configurable_options {
                        id
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
                            stock_status
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
                    }
                }
            }
        }
    }
`;

const ADD_PRODUCT_TO_CART = gql`
    mutation AddProductToCartFromDialog($cartId: String!, $cartItem: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
            cart {
                id
                ...CartTriggerFragment
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export default {
    addProductToCartMutation: ADD_PRODUCT_TO_CART,
    getProductDetailQuery: GET_PRODUCT_DETAIL
};
