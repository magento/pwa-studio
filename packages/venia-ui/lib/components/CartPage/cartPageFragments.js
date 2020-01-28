import gql from 'graphql-tag';

import { ProductListingFragment } from './ProductListing/productListingFragments';
import { PriceSummaryFragment } from './PriceSummary/priceSummaryFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        ...ProductListingFragment
        ...PriceSummaryFragment
    }
    ${ProductListingFragment}
    ${PriceSummaryFragment}
`;
