import gql from 'graphql-tag';

import { ProductListingFragment } from './ProductListing/productListingFragments';
import { PriceSummaryFragment } from './PriceSummary/priceSummaryFragments';
import { AppliedCouponsFragment } from './PriceAdjustments/CouponCode/couponCodeFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        ...AppliedCouponsFragment
        ...ProductListingFragment
        ...PriceSummaryFragment
    }
    ${AppliedCouponsFragment}
    ${ProductListingFragment}
    ${PriceSummaryFragment}
`;
