import gql from 'graphql-tag';

const GET_CUSTOM_ADDITIONAL_QUOTE_DATA = gql`
    query cart($cart_id: String!) {
        cart(cart_id: $cart_id) {
            comment
            external_order_number
        }
    }
`;

const SET_CUSTOM_ATTRIBUTE_QUOTE_SAVE = gql`
    mutation customAttributeQuoteSave($masked_id: String!, $comment: String, $external_order_number: String) {
        customAttributeQuoteSave(
            masked_id: $masked_id
            comment: $comment
            external_order_number: $external_order_number
        ) {
            status
            message
        }
    }
`;

export default {
    getCustomAdditionalQuoteData: GET_CUSTOM_ADDITIONAL_QUOTE_DATA,
    setCustomAttributeQuoteSave: SET_CUSTOM_ATTRIBUTE_QUOTE_SAVE
};
