import gql from 'graphql-tag';

import { SET_CUSTOMER_ADDRESS_ON_CART } from '../ShippingInformation/shippingInformation.gql';
import { CustomerAddressFragment } from './addressBookFragments.gql';
import { ShippingInformationFragment } from '../ShippingInformation/shippingInformationFragments.gql';

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses {
        customer {
            id
            addresses {
                id
                ...CustomerAddressFragment
            }
        }
    }
    ${CustomerAddressFragment}
`;

export const GET_CUSTOMER_CART_ADDRESS = gql`
    query GetCustomerCartAddress {
        customerCart {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export default {
    mutations: {
        setCustomerAddressOnCartMutation: SET_CUSTOMER_ADDRESS_ON_CART
    },
    queries: {
        getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
        getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESS
    }
};
