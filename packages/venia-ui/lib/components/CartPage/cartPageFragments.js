import gql from 'graphql-tag';

import { GiftCardFragment } from './GiftCards/giftCardFragments';
import { ProductListingFragment } from './ProductListing/productListingFragments';
import { PriceSummaryFragment } from './PriceSummary/priceSummaryFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        ...GiftCardFragment
        ...ProductListingFragment
        ...PriceSummaryFragment
    }
    ${GiftCardFragment}
    ${ProductListingFragment}
    ${PriceSummaryFragment}
`;
