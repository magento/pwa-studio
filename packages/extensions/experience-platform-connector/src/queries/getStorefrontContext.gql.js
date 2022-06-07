import { gql } from '@apollo/client';

export const GET_STOREFRONT_CONTEXT = gql`
  query storefrontContext {
    storeConfig {
      store_code
      store_name
      store_group_name
      store_group_code
      locale
      base_currency_code
      website_name
      website_code
      base_url
    }
  }
`;

export default {
  getStorefrontContext: GET_STOREFRONT_CONTEXT,
};