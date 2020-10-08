import { gql } from '@apollo/client';

export const CREATE_ACCOUNT = gql`
    mutation CreateAccountAfterCheckout(
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
            customer {
                id
            }
        }
    }
`;

export const GET_CUSTOMER = gql`
    query GetCustomerAfterCheckout {
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
    mutation SignInAfterCheckout($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const CREATE_CART = gql`
    mutation CreateCartAfterCheckout {
        cartId: createEmptyCart
    }
`;

export const GET_CART_DETAILS = gql`
    query GetCartDetailsAfterCheckout($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                prices {
                    price {
                        value
                    }
                }
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
        }
    }
`;

export default {
    createAccountMutation: CREATE_ACCOUNT,
    createCartMutation: CREATE_CART,
    getCartDetailsQuery: GET_CART_DETAILS,
    getCustomerQuery: GET_CUSTOMER,
    signInMutation: SIGN_IN
};
