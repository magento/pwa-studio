import { gql } from '@apollo/client';

// GraphQL query to fetch a list of categories for a product
export const IS_REQUIRED_LOGIN = gql`
    query isRequiredLogin {
        storeConfig {
            is_required_login
        }
    }
`;

export default {
    getIsRequiredLogin: IS_REQUIRED_LOGIN
};
