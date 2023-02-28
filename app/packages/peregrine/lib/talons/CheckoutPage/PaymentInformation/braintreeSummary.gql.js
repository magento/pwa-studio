import { gql } from '@apollo/client';

export const GET_SUMMARY_DATA = gql`
    query GetSummaryDataForBraintree($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            isBillingAddressSame @client
            paymentNonce @client
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    label
                }
                postalCode: postcode
                phoneNumber: telephone
            }
        }
    }
`;

export default {
    getSummaryDataForBraintreeQuery: GET_SUMMARY_DATA
};
