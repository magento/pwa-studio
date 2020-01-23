import gql from 'graphql-tag';

import { DiscountSummaryFragment } from './discountSummary';
import { GiftCardSummaryFragment } from './giftCardSummary';
import { ShippingSummaryFragment } from './shippingSummary';
import { TaxSummaryFragment } from './taxSummary';

export const PriceSummaryFragment = gql`
    fragment PriceSummaryFragment on Cart {
        id
        items {
            quantity
        }
        ...ShippingSummaryFragment
        prices {
            ...TaxSummaryFragment
            ...DiscountSummaryFragment
            grand_total {
                currency
                value
            }
            subtotal_excluding_tax {
                currency
                value
            }
        }
        ...GiftCardSummaryFragment
    }
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
`;
