import { gql } from '@apollo/client';

export const GET_BREADCRUMBS = gql`
    query GetBreadcrumbs($category_id: String!) {
        categories(filters: { category_uid: { in: [$category_id] } }) {
            items {
                breadcrumbs {
                    category_uid
                    category_level
                    category_name
                    category_url_path
                }
                uid
                name
                url_path
            }
        }
    }
`;

export default {
    getBreadcrumbsQuery: GET_BREADCRUMBS
};
