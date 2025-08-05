/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Facet, Product, ProductView } from './fragments';

const ATTRIBUTE_METADATA_QUERY = `
    query attributeMetadata {
        attributeMetadata {
        sortable {
            label
            attribute
            numeric
        }
        filterableInSearch {
            label
            attribute
            numeric
        }
        }
    }
`;

const QUICK_SEARCH_QUERY = `
    query quickSearch(
        $phrase: String!
        $pageSize: Int = 20
        $currentPage: Int = 1
        $filter: [SearchClauseInput!]
        $sort: [ProductSearchSortInput!]
        $context: QueryContextInput
    ) {
        productSearch(
            phrase: $phrase
            page_size: $pageSize
            current_page: $currentPage
            filter: $filter
            sort: $sort
            context: $context
        ) {
            suggestions
            items {
                ...Product
            }
            page_info {
                current_page
                page_size
                total_pages
            }
        }
    }
    ${Product}
`;

const PRODUCT_SEARCH_QUERY = `
    query productSearch(
        $phrase: String!
        $pageSize: Int
        $currentPage: Int = 1
        $filter: [SearchClauseInput!]
        $sort: [ProductSearchSortInput!]
        $context: QueryContextInput
    ) {
        productSearch(
            phrase: $phrase
            page_size: $pageSize
            current_page: $currentPage
            filter: $filter
            sort: $sort
            context: $context
        ) {
            total_count
            items {
                ...Product
                ...ProductView
            }
            facets {
                ...Facet
            }
            page_info {
                current_page
                page_size
                total_pages
            }
        }
        attributeMetadata {
            sortable {
                label
                attribute
                numeric
            }
        }
    }
    ${Product}
    ${ProductView}
    ${Facet}
`;

const REFINE_PRODUCT_QUERY = `
    query refineProduct(
        $optionIds: [String!]!
        $sku: String!
    ) {
        refineProduct(
            optionIds: $optionIds
            sku: $sku
        ) {
            __typename
            id
            sku
            name
            inStock
            url
            urlKey
            images {
                label
                url
                roles
            }
            ... on SimpleProductView {
                price {
                    final {
                        amount {
                            value
                        }
                    }
                    regular {
                        amount {
                            value
                        }
                    }
                }
            }
            ... on ComplexProductView {
                options {
                    id
                    title
                    required
                    values {
                        id
                        title
                    }
                }
                priceRange {
                    maximum {
                        final {
                            amount {
                                value
                            }
                        }
                        regular {
                            amount {
                                value
                            }
                        }
                    }
                    minimum {
                        final {
                            amount {
                                value
                            }
                        }
                        regular {
                            amount {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;

const GET_CUSTOMER_CART = `
    query customerCart {
        customerCart {
            id
            items {
            id
            product {
                name
                sku
            }
            quantity
            }
        }
    }
`;

const GET_CUSTOMER_WISHLISTS = `
    query customer {
      customer {
        wishlists {
          id
          name
          items_count
          items_v2 {
            items {
            id
              product {
              uid
              name
              sku
              }
            }
          }
        }
      }
    }
`;

export {
    ATTRIBUTE_METADATA_QUERY,
    PRODUCT_SEARCH_QUERY,
    QUICK_SEARCH_QUERY,
    REFINE_PRODUCT_QUERY,
    GET_CUSTOMER_CART,
    GET_CUSTOMER_WISHLISTS
};
