import gql from 'graphql-tag';

import { ProductDetailsFragment } from '../Product/product.gql';

export const GET_CATEGORY_DATA = gql`
    query category(
        $id: Int!
        $pageSize: Int!
        $currentPage: Int!
        $onServer: Boolean!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        category(id: $id) {
            id
            description
            name
            product_count
            meta_title @include(if: $onServer)
            meta_keywords @include(if: $onServer)
            meta_description
        }
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                ...ProductDetailsFragment
                # Even though these are already requested in the fragment,
                # the server may return an incorrect response if you don't hard
                # code the fields.
                # https://github.com/magento/graphql-ce/issues/1027
                description {
                    html
                }
                media_gallery_entries {
                    id
                    label
                    position
                    disabled
                    file
                }
                meta_description
                small_image {
                    url
                }
                url_key
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
    ${ProductDetailsFragment}
`;
