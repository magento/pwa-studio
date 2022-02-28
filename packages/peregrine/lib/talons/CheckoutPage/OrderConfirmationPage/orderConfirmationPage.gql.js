import { gql } from '@apollo/client';

export const GET_ORDER_CONFIRMATION_DETAILS = gql`
    query getOrderConfirmationDetails($orderNumber: String!) {
        customer {
            email
            orders(filter: { number: { eq: $orderNumber } }) {
                items {
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
