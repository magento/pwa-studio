import { gql } from '@apollo/client';

const GET_ATTRIBUTE_METADATA = gql`
    query GetSubtypeMetadata {
        customAttributeMetadata(
            attributes: [
                { attribute_code: "sub_type", entity_type: "catalog_product" }
            ]
        ) {
            items {
                attribute_options {
                    label
                    value
                }
            }
        }
    }
`;

export default {
    getAttributeMetadataQuery: GET_ATTRIBUTE_METADATA
};
