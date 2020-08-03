import gql from 'graphql-tag';

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
                # id is always required, even if the fragment includes it.
                id
                # TODO: Once this issue is resolved we can use the
                # GalleryItemFragment here:
                # https://github.com/magento/magento2/issues/28584
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                small_image {
                    url
                }
                url_key
                url_suffix
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
`;
