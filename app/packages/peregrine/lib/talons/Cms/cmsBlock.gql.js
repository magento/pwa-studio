import { gql } from '@apollo/client';

export const GET_CMS_BLOCKS = gql`
    query GetCmsBlocks($identifiers: [String]!) {
        cmsBlocks(identifiers: $identifiers) {
            items {
                content
                identifier
            }
        }
    }
`;

export default {
    getCmsBlocksQuery: GET_CMS_BLOCKS
};
