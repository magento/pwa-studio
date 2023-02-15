import { gql } from '@apollo/client';

export const GET_EXTENSION_CONTEXT = gql`
    query experiencePlatformConnectorContext {
        dataServicesStorefrontInstanceContext {
            environment_id
            environment
            store_url
            website_id
            website_code
            store_id
            store_code
            store_view_id
            store_view_code
            website_name
            store_name
            store_view_name
            base_currency_code
            store_view_currency_code
            catalog_extension_version
            ims_org_id
        }
        experienceConnectorContext {
            datastream_id
        }
    }
`;

export default {
    getExtensionContext: GET_EXTENSION_CONTEXT
};
