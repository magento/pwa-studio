import gql from 'graphql-tag';

/* export const SET_NEWSLETTER_SUBSCRIPTION = gql`
    mutation SetNewsletterSubscription($isSubscribed: Boolean!) {
        updateCustomer(input: { is_subscribed: $isSubscribed }) {
            customer {
                id
                is_subscribed
            }
        }
    }
`; */

export const GET_CUSTOMER_INFORMATION = gql`
    query GetCustomerInformation {
        customer {
            id
            firstname
            lastname
            email
            # password
        }
    }
`;

export default {
    /* mutations: {
        setNewsletterSubscriptionMutation: SET_NEWSLETTER_SUBSCRIPTION
    }, */
    queries: {
        getCustomerInformationQuery: GET_CUSTOMER_INFORMATION
    }
};
