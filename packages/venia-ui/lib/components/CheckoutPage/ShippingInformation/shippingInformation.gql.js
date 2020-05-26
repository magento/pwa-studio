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

export const GET_DEFAULT_SHIPPING = gql`
    query GetDefaultShipping {
        customer {
            id
            default_shipping
        }
    }
`;

export const SET_CUSTOMER_ADDRESS_ON_CART = gql`
    mutation SetCustomerAddressOnCart($cartId: String!, $addressId: Int!) {
        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ customer_address_id: $addressId }]
            }
        ) @connection(key: "setShippingAddressesOnCart") {
            cart {
                id
                ...ShippingInformationFragment
            }
        }
    }
    ${ShippingInformationFragment}
`;

export default {
    mutations: {
        setDefaultAddressMutation: SET_CUSTOMER_ADDRESS_ON_CART
    },
    queries: {
        getDefaultShippingQuery: GET_DEFAULT_SHIPPING,
        getShippingInformationQuery: GET_SHIPPING_INFORMATION
    }
};
