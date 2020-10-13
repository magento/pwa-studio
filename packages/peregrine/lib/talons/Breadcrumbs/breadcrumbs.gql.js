import { gql } from '@apollo/client';

export const GET_BREADCRUMBS = gql`
    query GetBreadcrumbs($category_id: Int!) {
        category(id: $category_id) {
            breadcrumbs {
                category_id
                # We may not need level if \`breadcrumbs\` is sorted.
                category_level
                category_name
                category_url_path
            }
            id
            name
            url_path
            url_suffix
        }
    }
`;

export default {
    getBreadcrumbsQuery: GET_BREADCRUMBS
};
