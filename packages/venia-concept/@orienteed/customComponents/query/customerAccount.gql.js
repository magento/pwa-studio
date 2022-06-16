import { gql } from '@apollo/client';

export const CREATE_ACCOUNT_BE_CUSTOMER = gql`
    mutation beCustomerSendMail($email: String!, $nif: String!, $no_of_client: Int!) {
        beCustomerSendMail(email: $email, nif: $nif, no_of_client: $no_of_client) {
            error
            message
        }
    }
`;

export const CREATE_ACCOUNT_NON_CUSTOMER = gql`
    mutation nonCustomerSendMail(
        $email: String!
        $name: String!
        $nif: String!
        $address1: String!
        $address2: String!
        $postal_code: String!
        $population: Int!
        $province: String!
        $country: String!
        $contact_name: String!
        $phone_number: String!
    ) {
        nonCustomerSendMail(
            email: $email
            name: $name
            nif: $nif
            address1: $address1
            address2: $address2
            postal_code: $postal_code
            population: $population
            province: $province
            country: $country
            contact_name: $contact_name
            phone_number: $phone_number
        ) {
            error
            message
        }
    }
`;
