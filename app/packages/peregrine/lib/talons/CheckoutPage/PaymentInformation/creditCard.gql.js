import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from './paymentInformation.gql';

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            paymentNonce
        }
    }
`;

export const SET_CC_DETAILS_ON_CART = gql`
    mutation setSelectedPaymentMethod($cartId: String!, $paymentNonce: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "braintree"
                    braintree: { payment_method_nonce: $paymentNonce, is_active_payment_token_enabler: false }
                }
            }
        ) @connection(key: "setPaymentMethodOnCart") {
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
    setCreditCardDetailsOnCartMutation: SET_CC_DETAILS_ON_CART
};
