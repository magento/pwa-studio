import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { ShippingInformationFragment } from '../ShippingInformation/shippingInformationFragments.gql';
import {
    AvailableShippingMethodsCheckoutFragment,
    SelectedShippingMethodCheckoutFragment
} from './shippingMethodFragments.gql';

export const GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS = gql`
    query GetSelectedAndAvailableShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...AvailableShippingMethodsCheckoutFragment
            ...SelectedShippingMethodCheckoutFragment
            ...ShippingInformationFragment
        }
    }
    ${AvailableShippingMethodsCheckoutFragment}
    ${SelectedShippingMethodCheckoutFragment}
    ${ShippingInformationFragment}
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($cartId: String!, $shippingMethod: ShippingMethodInput!) {
        setShippingMethodsOnCart(input: { cart_id: $cartId, shipping_methods: [$shippingMethod] }) {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...AvailableShippingMethodsCheckoutFragment
                ...PriceSummaryFragment
                ...SelectedShippingMethodCheckoutFragment
                ...ShippingInformationFragment
            }
        }
    }
    ${AvailableShippingMethodsCheckoutFragment}
    ${PriceSummaryFragment}
    ${SelectedShippingMethodCheckoutFragment}
    ${ShippingInformationFragment}
`;

export default {
    getSelectedAndAvailableShippingMethodsQuery: GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS,
    setShippingMethodMutation: SET_SHIPPING_METHOD
};
