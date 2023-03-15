import { gql } from '@apollo/client';

const subscriberOutput = gql`
    fragment subscriberOutput on MpSubscriberOutput {
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
    query getCustomersAlerts($priceCurrentPage: Int = 1, $stockCurrentPage: Int = 1) {
        customer {
            mp_product_alert {
                product_price(pageSize: 5, currentPage: $priceCurrentPage) {
                    pageInfo {
                        currentPage
                        hasNextPage
                        pageSize
                    }
                    total_count
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
                        product_data {
                            name
                            product_image_url
                            sku
                        }
                        type
                        website_id
                        __typename
                    }
                }
                out_of_stock(pageSize: 5, currentPage: $stockCurrentPage) {
                    total_count
                    pageInfo {
                        currentPage
                        hasNextPage
                        pageSize
                    }
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
                        product_data {
                            name
                            product_image_url
                            sku
                        }
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
    mutation MpProductAlertNotifyPriceDrops($productSku: String!, $email: String!) {
        MpProductAlertNotifyPriceDrops(input: { productSku: $productSku, email: $email }) {
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
        MpProductAlertNotifyInStock(input: { productSku: $productSku, email: $email }) {
            ...subscriberOutput
        }
    }
    ${subscriberOutput}
`;

export const SUBMIT_DELETE_ALERT = gql`
    mutation MpProductAlertSubscriberDelete($id: Int!) {
        MpProductAlertSubscriberDelete(input: { id: $id })
    }
`;

export const GET_CONFIG_ALERTS = gql`
    query MpProductAlertsConfigs {
        MpProductAlertsConfigs {
            price_alert {
                popup_setting {
                    button_text
                    description
                    footer_content
                    heading_text
                    place_holder
                }
            }
            stock_alert {
                popup_setting {
                    button_text
                    description
                    footer_content
                    heading_text
                    place_holder
                }
            }
        }
    }
`;
export default {
    GET_CUSTOMERS_ALERTS,
    SUBMIT_CUSTOMER_PRICE_ALERT,
    SUBMIT_GUEST_PRICE_ALERT,
    SUBMIT_CUSTOMER_STOCK_ALERT,
    SUBMIT_GUEST_STOCK_ALERT,
    SUBMIT_DELETE_ALERT,
    GET_CONFIG_ALERTS
};
