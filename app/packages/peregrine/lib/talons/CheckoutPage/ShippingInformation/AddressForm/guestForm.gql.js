import { gql } from '@apollo/client';

import { AvailablePaymentMethodsFragment } from '../../PaymentInformation/paymentInformation.gql';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { ShippingInformationFragment } from '../shippingInformationFragments.gql';
import { ShippingMethodsCheckoutFragment } from '../../ShippingMethod/shippingMethodFragments.gql';

export const IS_EMAIL_AVAILABLE = gql`
    query IsEmailAvailable($email: String!) {
        isEmailAvailable(email: $email) {
            is_email_available
        }
    }
`;

export const SET_GUEST_SHIPPING = gql`
    mutation SetGuestShipping($cartId: String!, $email: String!, $address: CartAddressInput!) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
            cart {
                id
            }
        }
        setShippingAddressesOnCart(input: { cart_id: $cartId, shipping_addresses: [{ address: $address }] }) {
            cart {
                id
                ...AvailablePaymentMethodsFragment
                ...PriceSummaryFragment
                ...ShippingInformationFragment
                ...ShippingMethodsCheckoutFragment
            }
        }
    }
    ${AvailablePaymentMethodsFragment}
    ${PriceSummaryFragment}
    ${ShippingInformationFragment}
    ${ShippingMethodsCheckoutFragment}
`;

export default {
    isEmailAvailableQuery: IS_EMAIL_AVAILABLE,
    setGuestShippingMutation: SET_GUEST_SHIPPING
};
