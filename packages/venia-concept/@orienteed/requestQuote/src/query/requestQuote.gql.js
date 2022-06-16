import { gql } from '@apollo/client';

export const GET_CONFIG_DETAILS = gql`
    query getConfigDetails {
        mpQuoteConfig {
            allow_category
            category
            customer_groups
            file_type
            icon_url
            is_allow_attach
            is_allow_guest
            redirect_page
        }
    }
`;

export const GET_MP_QUOTE_LIST = gql`
    query getMpQuoteList($filter: MpQuoteFilterInput, $pageSize: Int, $currentPage: Int) {
        mpQuoteList(filter: $filter, currentPage: $currentPage, pageSize: $pageSize) {
            page_info {
                current_page
                page_size
                total_pages
            }
            items {
                created_at
                quote_currency_code
                status
                subtotal
                entity_id
                expired_at
                discount
                items {
                    name
                    sku
                    request_price
                    qty
                    discount
                    prices {
                        total_item_discount {
                            currency
                            value
                        }
                        row_total {
                            currency
                            value
                        }
                        price {
                            currency
                            value
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const ADD_SIMPLE_PRODUCT_TO_MP_QUOTE = gql`
    mutation addSimpleProductsToMpQuote($input: AddSimpleProductsToQuoteInput) {
        addSimpleProductsToMpQuote(input: $input) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        url_key
                        url_suffix
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const ADD_CONFIG_PRODUCT_TO_MP_QUOTE = gql`
    mutation addConfigurableProductsToMpQuote($input: AddConfigurableProductsToQuoteInput) {
        addConfigurableProductsToMpQuote(input: $input) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        url_key
                        url_suffix
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const MP_QUOTE = gql`
    query mpQuote($quote_id: Int) {
        mpQuote(quote_id: $quote_id) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        url_key
                        url_suffix
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const DELETE_ITEM_FROM_MP_QUOTE = gql`
    mutation deleteItemFromMpQuote($itemId: Int!) {
        deleteItemFromMpQuote(item_id: $itemId) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const UPDATE_MP_QUOTE = gql`
    mutation updateMpQuote($input: updateMpQuoteInput!) {
        updateMpQuote(input: $input) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

// Add Item By Sku
export const ADD_ITEM_BY_SKU = gql`
    mutation addItemsBySkuToMpQuote($input: AddItemsBySkuToMpQuoteInput) {
        addItemsBySkuToMpQuote(input: $input) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const GET_PRODUCTS = gql`
    query products($search: String) {
        products(search: $search) {
            items {
                name
                sku
                type_id
                small_image {
                    url
                }
                url_key
                url_suffix
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
        }
    }
`;

export const DELETE_CURRENT_QUOTE = gql`
    mutation deleteCurrentMpQuote {
        deleteCurrentMpQuote
    }
`;

export const DELETE_SUBMITTED_MP_QUOTE = gql`
    mutation deleteSubmittedMpQuote($quoteId: Int!) {
        deleteSubmittedMpQuote(quote_id: $quoteId)
    }
`;

export const CANCEL_MP_QUOTE = gql`
    mutation cancelMpQuote($quoteId: Int!) {
        cancelMpQuote(quote_id: $quoteId)
    }
`;

export const DUPLICATE_MP_QUOTE = gql`
    mutation duplicateMpQuote($quoteId: Int!) {
        duplicateMpQuote(quote_id: $quoteId) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const ADD_MP_QUOTE_TO_CART = gql`
    mutation addMpQuoteToCart($quoteId: Int!) {
        addMpQuoteToCart(quote_id: $quoteId) {
            cart {
                id
            }
        }
    }
`;

export const GET_CUSTOMER = gql`
    query getCustomer {
        customer {
            mp_quote_id
        }
    }
`;

export const SUBMIT_CURRENT_QUOTE = gql`
    mutation submitCurrentQuote {
        mpQuoteSubmit
    }
`;
