import gql from 'graphql-tag';

// TODO: get only active categories from graphql when it is ready
export default gql`
    query categoryList($id: Int!) {
        category(id: $id) {
            children {
                name
                url_key
                url_path
                image
                productImagePreview: products(pageSize: 1) {
                    items {
                        small_image
                    }
                }
            }
        }
    }
`;
