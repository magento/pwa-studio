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
    }
`;

export default {
    getCmsPageQuery: GET_CMS_PAGE
};
