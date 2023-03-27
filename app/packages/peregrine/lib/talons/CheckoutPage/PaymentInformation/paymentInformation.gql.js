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
    query GetPaymentInformation($cartId: String!) {
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
    query GetPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            paymentNonce
        }
    }
`;

export default {
    getPaymentInformationQuery: GET_PAYMENT_INFORMATION,
    getPaymentNonceQuery: GET_PAYMENT_NONCE
};
