import { gql } from '@apollo/client';

import {
    CategoryFragment,
    ProductsFragment
} from '@magento/peregrine/lib/talons/RootComponents/Category/categoryFragments.gql';

export const GET_CATEGORY = gql`
    query GetCategoriesWithSubType(
        $id: Int!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        category(id: $id) {
            uid
            ...CategoryFragment
        }
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                id
                sub_type
            }
            ...ProductsFragment
        }
    }
    ${CategoryFragment}
    ${ProductsFragment}
`;
