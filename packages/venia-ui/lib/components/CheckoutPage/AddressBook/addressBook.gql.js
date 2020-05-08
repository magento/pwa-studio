import gql from 'graphql-tag';

import { SET_DEFAULT_ADDRESS } from '../ShippingInformation/shippingInformation.gql';
import { CustomerAddressFragment } from './addressBookFragments.gql';
import { ShippingInformationFragment } from '../ShippingInformation/shippingInformationFragments.gql';

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses {
        customer {
            email
            addresses {
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
        setCustomerAddressOnCartMutation: SET_DEFAULT_ADDRESS
    },
    queries: {
        getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
        getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESS
    }
};
