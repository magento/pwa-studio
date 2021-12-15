import { gql } from '@apollo/client';
import { CheckoutPageFragment } from '../CheckoutPage/checkoutPageFragments.gql';

export const CREATE_ACCOUNT = gql`
    mutation CreateAccount(
        $email: String!
        $firstname: String!
        $lastname: String!
        $password: String!
        $is_subscribed: Boolean!
    ) {
        createCustomer(
            input: {
                email: $email
                firstname: $firstname
                lastname: $lastname
                password: $password
                is_subscribed: $is_subscribed
            }
        ) {
            # The createCustomer mutation returns a non-nullable CustomerOutput type
            # which requires that at least one of the sub fields be returned.

            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            customer {
                email
            }
        }
    }
`;

export const GET_CUSTOMER = gql`
    query GetCustomerAfterCreate {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const SIGN_IN = gql`
    mutation SignInAfterCreate($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const CREATE_CART = gql`
    mutation CreateCartAfterAccountCreation {
        cartId: createEmptyCart
    }
`;

export const GET_CART_DETAILS = gql`
    query GetCartDetailsAfterAccountCreation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                prices {
                    price {
                        value
                    }
                }
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
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
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableCartItem {
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    configurable_options {
                        configurable_product_option_uid
                        option_label
                        configurable_product_option_value_uid
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
        }
    }
`;

export const MERGE_CARTS = gql`
    mutation MergeCartsAfterAccountCreation(
        $sourceCartId: String!
        $destinationCartId: String!
    ) {
        mergeCarts(
            source_cart_id: $sourceCartId
            destination_cart_id: $destinationCartId
        ) {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export default {
    createAccountMutation: CREATE_ACCOUNT,
    createCartMutation: CREATE_CART,
    getCartDetailsQuery: GET_CART_DETAILS,
    getCustomerQuery: GET_CUSTOMER,
    mergeCartsMutation: MERGE_CARTS,
    signInMutation: SIGN_IN
};
