import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_FOR_LIVE_SEARCH_POPOVER = gql`
    query GetStoreConfigForLiveSearchPopover {
        storeConfig {
            ls_environment_id
            website_code
            store_group_code
            store_code
            ls_autocomplete_limit
            ls_min_query_length
            #currency_symbol
            base_currency_code
            #currency_rate
            ls_display_out_of_stock
            ls_allow_all
            ls_locale
            ls_page_size_options
            ls_page_size_default
            base_url
        }
        currency {
            default_display_currency_code
            default_display_currency_symbol
        }
    }
`;
