import gql from 'graphql-tag';
import { ItemsReviewFragment } from '../ItemsReview/itemsReviewFragments.gql';

export const OrderConfirmationPageFragment = gql`
    fragment OrderConfirmationPageFragment on Cart {
        id
        email
        total_quantity
        shipping_addresses {
            firstname
            lastname
            street
            city
            region {
                label
            }
            postcode
            country {
                label
            }

            selected_shipping_method {
                carrier_title
                method_title
            }
        }
        ...ItemsReviewFragment
    }
    ${ItemsReviewFragment}
`;
