import { gql } from '@apollo/client';

export const GET_CMS_PAGE = gql`
    query GetCmsPage($identifier: String!) {
        cmsPage(identifier: $identifier) {
            url_key
            content
            content_heading
            title
            page_layout
            meta_title
            meta_keywords
            meta_description
        }
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            root_category_id
        }
    }
`;

export default {
    getCMSPageQuery: GET_CMS_PAGE
};
