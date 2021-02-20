import { gql } from '@apollo/client';

import { GiftCardFragment } from './GiftCards/giftCardFragments';
import { ProductListingFragment } from './ProductListing/productListingFragments';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { AppliedCouponsFragment } from './PriceAdjustments/CouponCode/couponCodeFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        ...AppliedCouponsFragment
        ...GiftCardFragment
        ...ProductListingFragment
        ...PriceSummaryFragment
    }
    ${AppliedCouponsFragment}
    ${GiftCardFragment}
    ${ProductListingFragment}
    ${PriceSummaryFragment}
`;
