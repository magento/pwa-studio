import { gql } from '@apollo/client';
import { ProductListFragment } from './ProductList/productListFragments.gql';

export const MiniCartFragment = gql`
    fragment MiniCartFragment on Cart {
        id
        total_quantity
        prices {
            subtotal_excluding_tax {
                currency
                value
            }
        }
        ...ProductListFragment
    }
    ${ProductListFragment}
`;
