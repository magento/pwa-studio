import { gql } from '@apollo/client';

/**
 * Custom type policies necessary for the summary query.
 */
export const CUSTOM_TYPES = {
    Cart: {
        fields: {
            /**
             * @client field policies must be defined if queried along server
             * props or the entire query will return null.
             */
            isBillingAddressSame: {
                read(cached) {
                    return cached !== false;
                }
            },
            paymentNonce: {
                read(cached) {
                    return cached || null;
                }
            }
        }
    }
};

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const GET_SUMMARY_DATA = gql`
    query getSummaryData($cartId: String!) {
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
                    code
                }
                postalCode: postcode
                phoneNumber: telephone
            }
            selected_payment_method {
                code
                title
            }
        }
    }
`;
/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getSummaryData: GET_SUMMARY_DATA
    },
    mutations: {}
};
