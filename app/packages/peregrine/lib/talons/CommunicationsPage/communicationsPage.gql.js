import { gql } from '@apollo/client';

export const SET_NEWSLETTER_SUBSCRIPTION = gql`
    mutation SetNewsletterSubscription($isSubscribed: Boolean!) {
        updateCustomer(input: { is_subscribed: $isSubscribed }) {
            customer {
                is_subscribed
            }
        }
    }
`;

export const GET_CUSTOMER_SUBSCRIPTION = gql`
    query GetCustomerSubscription {
        customer {
            is_subscribed
        }
    }
`;

export default {
    getCustomerSubscriptionQuery: GET_CUSTOMER_SUBSCRIPTION,
    setNewsletterSubscriptionMutation: SET_NEWSLETTER_SUBSCRIPTION
};
