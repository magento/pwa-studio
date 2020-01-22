import gql from 'graphql-tag';

import { PriceSummaryFragment } from './PriceSummary/priceSummaryFragments';
import { ProductListingFragment } from './ProductListing/productListingFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        ...PriceSummaryFragment
        ...ProductListingFragment
    }
    ${PriceSummaryFragment}
    ${ProductListingFragment}
`;
