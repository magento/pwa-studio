import { gql } from '@apollo/client';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';

import { ShippingInformationFragment } from '../shippingInformationFragments.gql';
import { ShippingMethodsCheckoutFragment } from '../../ShippingMethod/shippingMethodFragments.gql';
import { AvailablePaymentMethodsFragment } from '../../PaymentInformation/paymentInformation.gql';

export const SET_GUEST_SHIPPING_MUTATION = gql`
    mutation SetGuestShipping(
        $cartId: String!
        $email: String!
        $address: CartAddressInput!
    ) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
            cart {
                id
            }
        }

        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ address: $address }]
            }
        ) {
            cart {
                id
                ...ShippingInformationFragment
                ...ShippingMethodsCheckoutFragment
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${ShippingInformationFragment}
    ${ShippingMethodsCheckoutFragment}
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;

export const GET_EMAIL_AVAILABLE_QUERY = gql`
    query IsEmailAvailable($email: String!) {
        isEmailAvailable(email: $email) {
            is_email_available
        }
    }
`;

export default {
    setGuestShippingMutation: SET_GUEST_SHIPPING_MUTATION,
    getEmailAvailableQuery: GET_EMAIL_AVAILABLE_QUERY
};
