import { gql } from '@apollo/client';
import { PriceSummaryFragment } from './priceSummaryFragments.gql';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

export default {
    getPriceSummaryQuery: GET_PRICE_SUMMARY
};
