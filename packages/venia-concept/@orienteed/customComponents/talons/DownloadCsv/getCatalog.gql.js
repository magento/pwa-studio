// import { gql } from '@apollo/client';
// export const GET_TOTAL_PAGE = gql`
//     query getTotalPage {
//         products(
//             filter: { url_key: { eq: "" } }
//             currentPage: 1
//             pageSize: 10
//         ) {
//             page_info {
//                 total_pages
//             }
//         }
//     }
// `;
// export const GET_FULL_CATALOG = gql`
//     query getFullCatalog($currentPage: Int!) {
//         products(
//             filter: { url_key: { eq: "" } }
//             currentPage: $currentPage
//             pageSize: 10
//         ) {
//             items {
//                 ... on ConfigurableProduct {
//                     variants {
//                         product {
//                             name
//                             sku
//                             description {
//                                 html
//                             }
//                             categories {
//                                 name
//                             }
//                             price {
//                                 regularPrice {
//                                     amount {
//                                         currency
//                                         value
//                                     }
//                                 }
//                                 minimalPrice {
//                                     amount {
//                                         currency
//                                         value
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// `;

// export const GET_FULL_CATALOG_DISCOUNT_PRICE = gql`
//     query getFullCatalogDiscountPrice {
//         products(filter: { url_key: { eq: "" } }, pageSize: 30) {
//             items {
//                 ... on ConfigurableProduct {
//                     variants {
//                         product {
//                             name
//                             sku
//                             description {
//                                 html
//                             }
//                             categories {
//                                 name
//                             }
//                             price {
//                                 minimalPrice {
//                                     amount {
//                                         currency
//                                         value
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// `;
