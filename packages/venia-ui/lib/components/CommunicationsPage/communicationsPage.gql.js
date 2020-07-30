import gql from 'graphql-tag';

export const SET_NEWSLETTER_SUBSCRIPTION = gql`
    mutation updateCustomer($is_subscribed: Boolean!) {
        updateCustomer(input: { is_subscribed: $is_subscribed }) {
            customer {
                id
                is_subscribed
            }
        }
    }
`;

export const GET_CUSTOMER = gql`
    query GetCustomer {
        customer {
            id
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export default {
    mutations: {
        setNewsletterSubscriptionMutation: SET_NEWSLETTER_SUBSCRIPTION
    },
    queries: {
        getCustomerQuery: GET_CUSTOMER
    }
};
