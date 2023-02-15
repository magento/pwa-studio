import { gql } from '@apollo/client';

export const ADD_CONFIGURABLE_PRODUCT_TO_QUOTE = gql`
    mutation AddConfigurableProductsToQuote($input: AddConfigurableProductsToQuoteInput) {
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
                        uid
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

export const ADD_QUOTE_TO_CART = gql`
    mutation AddQuoteToCart($quoteId: Int!) {
        addMpQuoteToCart(quote_id: $quoteId) {
            cart {
                id
            }
        }
    }
`;

export const ADD_SIMPLE_PRODUCT_TO_QUOTE = gql`
    mutation AddSimpleProductsToQuote($input: AddSimpleProductsToQuoteInput) {
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
                        uid
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

export const CANCEL_QUOTE = gql`
    mutation CancelQuote($quoteId: Int!) {
        cancelMpQuote(quote_id: $quoteId)
    }
`;

export const DELETE_CURRENT_QUOTE = gql`
    mutation DeleteCurrentQuote {
        deleteCurrentMpQuote
    }
`;

export const DELETE_ITEM_FROM_QUOTE = gql`
    mutation DeleteItemFromQuote($itemId: Int!) {
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

export const DELETE_SUBMITTED_QUOTE = gql`
    mutation DeleteSubmittedQuote($quoteId: Int!) {
        deleteSubmittedMpQuote(quote_id: $quoteId)
    }
`;

export const DUPLICATE_QUOTE = gql`
    mutation DuplicateQuote($quoteId: Int!) {
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

export const GET_QUOTE_BY_ID = gql`
    query GetQuoteById($quote_id: Int) {
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

export const GET_QUOTE_CONFIG_DETAILS = gql`
    query GetConfigDetailsForQuote {
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

export const GET_QUOTE_LIST = gql`
    query GetQuoteList($filter: MpQuoteFilterInput, $pageSize: Int, $currentPage: Int) {
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

export const SUBMIT_CURRENT_QUOTE = gql`
    mutation SubmitCurrentQuote {
        mpQuoteSubmit
    }
`;

export const UPDATE_QUOTE = gql`
    mutation UpdateQuote($input: updateMpQuoteInput!) {
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

// TODO_B2B: remove these queries
export const GET_PRODUCTS = gql`
    query GetProductsForQuote($search: String) {
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

export const GET_CUSTOMER = gql`
    query GetCustomerForQuote {
        customer {
            mp_quote_id
        }
    }
`;

export default {
    addConfigurableProductToQuoteMutation: ADD_CONFIGURABLE_PRODUCT_TO_QUOTE,
    addQuoteToCartMutation: ADD_QUOTE_TO_CART,
    addSimpleProductToQuoteMutation: ADD_SIMPLE_PRODUCT_TO_QUOTE,
    cancelQuoteMutation: CANCEL_QUOTE,
    deleteCurrentQuoteMutation: DELETE_CURRENT_QUOTE,
    deleteItemFromQuoteMutation: DELETE_ITEM_FROM_QUOTE,
    deleteSubmittedQuoteMutation: DELETE_SUBMITTED_QUOTE,
    duplicateQuoteMutation: DUPLICATE_QUOTE,
    getQuoteByIdQuery: GET_QUOTE_BY_ID,
    getQuoteConfigDetailsQuery: GET_QUOTE_CONFIG_DETAILS,
    getQuoteListQuery: GET_QUOTE_LIST,
    submitCurrentQuoteMutation: SUBMIT_CURRENT_QUOTE,
    updateQuoteMutation: UPDATE_QUOTE,

    getCustomerQuery: GET_CUSTOMER,
    getProductsQuery: GET_PRODUCTS
};
