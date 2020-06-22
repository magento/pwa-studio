import gql from 'graphql-tag';

import { CartPageFragment } from '../components/CartPage/cartPageFragments.gql';
import { CartTriggerFragment } from '../components/Header/cartTriggerFragments.gql';
import { CheckoutPageFragment } from '../components/CheckoutPage/checkoutPageFragments.gql';

export const mergeCartsMutation = gql`
    mutation mergeCarts($sourceCartId: String!, $destinationCartId: String!) {
        mergeCarts(
            source_cart_id: $sourceCartId
            destination_cart_id: $destinationCartId
        ) @connection(key: "mergeCarts") {
            id
            ...CartPageFragment
            ...CartTriggerFragment
            ...CheckoutPageFragment
            # TODO: Create/use MiniCartFragment, etc.
            items {
                id
                product {
                    id
                    small_image {
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
    ${CartTriggerFragment}
    ${CartPageFragment}
    ${CheckoutPageFragment}
`;
