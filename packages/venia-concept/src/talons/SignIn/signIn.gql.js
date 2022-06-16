import { gql } from '@apollo/client';
import { CheckoutPageFragment } from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPageFragments.gql';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql';

export const GET_CUSTOMER = gql`
    query GetCustomerAfterSignIn {
        customer {
            id
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const CREATE_CART = gql`
    mutation CreateCartAfterSignIn {
        cartId: createEmptyCart
    }
`;

export const MERGE_CARTS = gql`
    mutation MergeCartsAfterSignIn($sourceCartId: String!, $destinationCartId: String!) {
        mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId)
            @connection(key: "mergeCarts") {
            id
            items {
                id
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const GET_MOODLE_TOKEN = gql`
    query GetMoodleToken {
        customer {
            moodle_token
        }
    }
`;

export const GET_MOODLE_ID = gql`
    query GetMoodleId {
        customer {
            moodle_id
        }
    }
`;

export const SET_MOODLE_TOKEN_ID = gql`
    mutation SetMoodleToken($moodle_token: String!, $moodle_id: String!) {
        updateCustomer(input: { moodle_token: $moodle_token, moodle_id: $moodle_id }) {
            customer {
                moodle_token
                moodle_id
            }
        }
    }
`;

export const GET_CART_DETAILS_QUERY = gql`
    query GetCartDetailsAfterSignIn($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                product {
                    id
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        id
                        option_label
                        value_id
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;

export default {
    createCartMutation: CREATE_CART,
    getCustomerQuery: GET_CUSTOMER,
    mergeCartsMutation: MERGE_CARTS,
    signInMutation: SIGN_IN,
    getMoodleTokenQuery: GET_MOODLE_TOKEN,
    getMoodleIdQuery: GET_MOODLE_ID,
    setMoodleTokenAndIdMutation: SET_MOODLE_TOKEN_ID
};
