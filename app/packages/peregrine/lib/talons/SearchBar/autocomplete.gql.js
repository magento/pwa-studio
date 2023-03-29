import { gql } from '@apollo/client';

const GET_AUTOCOMPLETE_RESULTS = gql`
    query GetAutocompleteResults($inputText: String!) {
        # Limit results to first three
        products(search: $inputText, currentPage: 1, pageSize: 20) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
                position
            }
            items {
                __typename
                orParentSku
                orParentUrlKey
                stock_status
                id
                uid
                name
                sku
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
                    minimalPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                custom_attributes {
                    entered_attribute_value {
                        value
                    }
                    attribute_metadata {
                        __typename
                        label
                    }
                    selected_attribute_options {
                        __typename
                        attribute_option {
                            label
                            is_default
                        }
                    }
                }
            }

            page_info {
                total_pages
            }
            total_count
        }
    }
`;

export default {
    getAutocompleteResultsQuery: GET_AUTOCOMPLETE_RESULTS
};
