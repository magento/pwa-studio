import { gql } from '@apollo/client';

export const GET_ORDER_CONFIRMATION_DETAILS = gql`
    query getOrderConfirmationDetails($orderNumber: String!) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            email
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            orders(filter: { number: { eq: $orderNumber } }) {
                items {
                    id
                    shipping_address {
                        firstname
                        lastname
                        street
                        city
                        region
                        postcode
                        country_code
                    }
                    shipping_method
                }
            }
        }
    }
`;

export default {
    getOrderConfirmationDetailsQuery: GET_ORDER_CONFIRMATION_DETAILS
};
