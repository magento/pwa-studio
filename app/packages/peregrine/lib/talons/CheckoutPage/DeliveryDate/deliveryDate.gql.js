import { gql } from '@apollo/client';

export const GET_DELIVERY_DATE = gql`
    query GetDeliveryDate {
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

export const SET_DELIVERY_TIME = gql`
    mutation SetDeliveryTime($cart_id: String!, $mp_delivery_time: DeliveryTimeInput) {
        MpDeliveryTime(cart_id: $cart_id, mp_delivery_time: $mp_delivery_time)
    }
`;

export const GET_LOCALE = gql`
    query GetLocale {
        storeConfig {
            store_code
            locale
        }
    }
`;

export default {
    getDeliveryDateQuery: GET_DELIVERY_DATE,
    setDeliveryTimeMutation: SET_DELIVERY_TIME,
    getLocaleQuery: GET_LOCALE
};
