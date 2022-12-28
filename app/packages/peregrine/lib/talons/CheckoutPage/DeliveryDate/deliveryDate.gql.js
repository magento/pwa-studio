import { gql } from '@apollo/client';

const GET_DELIVERY_DATE = gql`
    query {
        deliveryTime {
            deliveryDateFormat
            deliveryDateOff
            deliveryDaysOff
            isEnabledDeliveryComment
            deliveryTime
            __typename
            isEnabledHouseSecurityCode
        }
    }
`;

const SET_DELIVERY_TIME = gql`
    mutation deliverytime($cart_id: String!, $mp_delivery_time: DeliveryTimeInput) {
        MpDeliveryTime(cart_id: $cart_id, mp_delivery_time: $mp_delivery_time)
    }
`;

const GET_LOCALE = gql`
    query getLocale {
        storeConfig {
            store_code
            locale
        }
    }
`;

export default { GET_DELIVERY_DATE, SET_DELIVERY_TIME, GET_LOCALE };
