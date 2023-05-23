import { gql } from '@apollo/client';

const SET_ORDER_ATTRIBUTES = gql`
    mutation SetOrderAttributes($masked_id: String!, $comment: String, $external_order_number: String) {
        customAttributeQuoteSave(
            masked_id: $masked_id
            comment: $comment
            external_order_number: $external_order_number
        ) {
            message
            status
            __typename
        }
    }
`;

export default {
    setOrderAttributesQuery: SET_ORDER_ATTRIBUTES
};
