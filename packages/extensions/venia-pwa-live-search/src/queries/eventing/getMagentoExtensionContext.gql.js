import { gql } from '@apollo/client';

export const GET_MAGENTO_EXTENSION_CONTEXT = gql`
    query magentoExtensionContext {
        magentoExtensionContext: dataServicesMagentoExtensionContext {
            magento_extension_version
        }
    }
`;

export default {
    getMagentoExtensionContext: GET_MAGENTO_EXTENSION_CONTEXT
};
