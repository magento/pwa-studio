import { gql } from '@apollo/client';

export const SUBMIT_CONTACT_FORM = gql`
    mutation SubmitContactForm($name: String!, $email: String!, $comment: String!, $telephone: String) {
        contactUs(input: { name: $name, email: $email, comment: $comment, telephone: $telephone }) {
            status
        }
    }
`;

export const GET_CONTACT_PAGE_CMS_BLOCKS = gql`
    query GetContactPageCmsBlocks($cmsBlockIdentifiers: [String]) {
        cmsBlocks(identifiers: $cmsBlockIdentifiers) {
            items {
                content
                identifier
            }
        }
    }
`;

export default {
    contactMutation: SUBMIT_CONTACT_FORM,
    getContactPageCmsBlocksQuery: GET_CONTACT_PAGE_CMS_BLOCKS
};
