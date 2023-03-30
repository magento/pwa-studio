import { gql } from '@apollo/client';

export const AccountInformationPageFragment = gql`
    fragment AccountInformationPageFragment on Customer {
        id
        firstname
        lastname
        email
        taxvat
        is_subscribed
        default_shipping
        mp_quote_id
    }
`;
