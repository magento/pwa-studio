import { gql } from '@apollo/client';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { GiftCardFragment } from './GiftCards/giftCardFragments.gql';
import { AppliedCouponsFragment } from './PriceAdjustments/CouponCode/couponCodeFragments.gql';
import { ProductListingFragment } from './ProductListing/productListingFragments.gql';

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
