import { gql } from '@apollo/client';

export const SEND_ORDER_INCIDENCES_EMAIL = gql`
    mutation orderIncidencesEmail($input: OrderIncidencesEmailInput) {
        orderIncidencesEmail(input: $input) {
            message
            status
        }
    }
`;

export default {
    sendOrderIncidencesEmail: SEND_ORDER_INCIDENCES_EMAIL
};
