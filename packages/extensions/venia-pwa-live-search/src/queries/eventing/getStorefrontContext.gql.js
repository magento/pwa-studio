import { gql } from '@apollo/client';

export const GET_STOREFRONT_CONTEXT = gql`
    query storefrontContext {
        storefrontInstanceContext: dataServicesStorefrontInstanceContext {
            catalog_extension_version
            environment
            environment_id
            store_code
            store_id
            store_name
            store_url
            store_view_code
            store_view_id
            store_view_name
            website_code
            website_id
            website_name
            store_view_currency_code
            base_currency_code
        }
    }
`;

export default {
    getStorefrontContext: GET_STOREFRONT_CONTEXT
};
