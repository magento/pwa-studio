import { gql } from '@apollo/client';

export const GET_SUMMARY_DATA = gql`
    query getSummaryData($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
                title
            }
        }
    }
`;

export default {
    getSummaryData: GET_SUMMARY_DATA
};
