import gql from 'graphql-tag';

import { ShippingInformationFragment } from './shippingInformationFragments.gql';

export const GET_SHIPPING_INFORMATION = gql`
    query GetShippingInformation($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export default {
    mutations: {},
    queries: {
        getShippingInformationQuery: GET_SHIPPING_INFORMATION
    }
};
