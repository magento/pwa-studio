import { gql } from '@apollo/client';
import { ShippingInformationFragment } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/shippingInformationFragments.gql.js';
import { CartPageFragment } from '../../cartPageFragments.gql';
import { ShippingMethodsCartFragment } from './shippingMethodsFragments.gql';

const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ShippingMethodsCartFragment
        }
    }
    ${ShippingMethodsCartFragment}
`;

const SET_SHIPPING_ADDRESS_MUTATION = gql`
    mutation SetShippingAddressForEstimate(
        $cartId: String!
        $address: CartAddressInput!
    ) {
        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ address: $address }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
                ...ShippingMethodsCartFragment
                ...ShippingInformationFragment
            }
        }
    }
    ${CartPageFragment}
    ${ShippingMethodsCartFragment}
    ${ShippingInformationFragment}
`;

export default {
    getShippingMethodsQuery: GET_SHIPPING_METHODS,
    setShippingAddressMutation: SET_SHIPPING_ADDRESS_MUTATION
};
