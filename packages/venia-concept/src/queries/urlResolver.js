import gql from 'graphql-tag';

export default gql`
    query resolveUrl($urlKey: String!) {
        urlResolver(url: $urlKey) {
            type
            id
        }
    }
`;
