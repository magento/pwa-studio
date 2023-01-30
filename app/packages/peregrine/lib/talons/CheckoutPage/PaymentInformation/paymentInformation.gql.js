import { gql } from '@apollo/client';

export const AvailablePaymentMethodsFragment = gql`
    fragment AvailablePaymentMethodsFragment on Cart {
        id
        available_payment_methods {
            code
            title
        }
    }
`;

export const GET_PAYMENT_INFORMATION = gql`
    query getPaymentInformation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
            }
            shipping_addresses {
                firstname
                lastname
                street
                city
                region {
                    code
                }
                postcode
                country {
                    code
                }
                telephone
            }
            ...AvailablePaymentMethodsFragment
        }
    }
    ${AvailablePaymentMethodsFragment}
`;

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            paymentNonce
        }
    }
`;

// Sets the provided payment method object on the cart.
export const SET_FREE_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCartForFree($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "free" } }) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    getPaymentNonceQuery: GET_PAYMENT_NONCE,
    getPaymentInformationQuery: GET_PAYMENT_INFORMATION,
    setFreePaymentMethodMutation: SET_FREE_PAYMENT_METHOD_ON_CART
};
