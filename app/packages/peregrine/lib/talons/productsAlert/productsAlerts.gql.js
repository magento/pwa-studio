import { gql } from '@apollo/client';

const subscriberOutput = gql`
    fragment subscriberOutput on MpMageplazaSubscriberOutput {
        customer_email
        customer_group
        customer_id
        last_send_date
        old_price
        product_id
        send_count
        status
        store_id
        subscribe_created_at
        subscribe_updated_at
        subscriber_id
        type
        website_id
        __typename
    }
`;


export const GET_CUSTOMERS_ALERTS = gql`
    query getCustomersAlerts {
        customer {
            mp_product_alert {
                product_price {
                    items {
                        customer_email
                        customer_group
                        customer_id
                        last_send_date
                        old_price
                        product_id
                        send_count
                        store_id
                        status
                        subscribe_created_at
                        subscribe_updated_at
                        subscriber_id
                        type
                        website_id
                        __typename
                    }
                }
                out_of_stock {
                    items {
                        customer_email
                        customer_group
                        customer_id
                        last_send_date
                        old_price
                        product_id
                        send_count
                        store_id
                        status
                        subscribe_created_at
                        subscribe_updated_at
                        subscriber_id
                        type
                        website_id
                        __typename
                    }
                }
            }
        }
    }
`;

export const SUBMIT_CUSTOMER_PRICE_ALERT = gql`
    mutation MpProductAlertCustomerNotifyPriceDrops($productSku: String!) {
        MpProductAlertCustomerNotifyPriceDrops(input: { productSku: $productSku }) {
            ...subscriberOutput
        }
    }
    ${subscriberOutput}
`;

export const SUBMIT_GUEST_PRICE_ALERT = gql`
    mutation MpProductAlertCustomerNotifyPriceDrops($productSku: String!, $email: String!) {
        MpProductAlertCustomerNotifyPriceDrops(input: { productSku: $productSku, email: $email }) {
            ...subscriberOutput
        }
    }
    ${subscriberOutput}
`;

export const SUBMIT_CUSTOMER_STOCK_ALERT = gql`
    mutation MpProductAlertCustomerNotifyInStock($productSku: String!) {
        MpProductAlertCustomerNotifyInStock(input: { productSku: $productSku }) {
            ...subscriberOutput
        }
    }
    ${subscriberOutput}
`;

export const SUBMIT_GUEST_STOCK_ALERT = gql`
    mutation MpProductAlertNotifyInStock($productSku: String!, $email: String!) {
        MpProductAlertCustomerNotifyPriceDrops(input: { productSku: $productSku, email: $email }) {
            ...subscriberOutput
        }
    }
    ${subscriberOutput}
`;
