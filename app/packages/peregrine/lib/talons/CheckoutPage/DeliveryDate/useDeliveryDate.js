import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation, useQuery } from '@apollo/client';
import { useReducer, useMemo } from 'react';

import DEFAULT_OPERATIONS from './deliveryDate.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const deliveryDateData = {
    mp_delivery_date: '',
    mp_delivery_time: '',
    mp_house_security_code: '',
    mp_delivery_comment: ''
};

function reducer(state, action) {
    switch (action.type) {
        case 'mp_delivery_date':
            return { ...state, mp_delivery_date: action.value };
        case 'mp_delivery_time':
            return { ...state, mp_delivery_time: action.value };
        case 'mp_house_security_code':
            return { ...state, mp_house_security_code: action.value };
        case 'mp_delivery_comment':
            return { ...state, mp_delivery_comment: action.value };
        default:
            throw new Error();
    }
}

export const useDeliveryDate = () => {
    const [state, dispatch] = useReducer(reducer, deliveryDateData);

    const { GET_DELIVERY_DATE, SET_DELIVERY_TIME, GET_LOCALE } = mergeOperations(DEFAULT_OPERATIONS);

    const handleChange = (name, value) => {
        dispatch({ type: name, value });
    };

    const { data } = useQuery(GET_LOCALE, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const local = useMemo(() => {
        return data && data.storeConfig.locale;
    }, [data]);

    const [{ cartId }] = useCartContext();

    const { data: deliveryDate } = useQuery(GET_DELIVERY_DATE, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [deliverytime] = useMutation(SET_DELIVERY_TIME);

    const deliveryDateIsActivated = useMemo(() => {
        if (deliveryDate?.deliveryTime) {
            return Object.keys(deliveryDate?.deliveryTime).every(
                ele => deliveryDate.deliveryTime[ele] || deliveryDate.deliveryTime[ele] === ''
            );
        }
    }, [deliveryDate]);

    const submitDeliveryDate = async () => {
        await deliverytime({
            variables: {
                cart_id: cartId,
                mp_delivery_time: state
            }
        });
    };

    return {
        deliveryDate,
        submitDeliveryDate,
        deliveryDateData: state,
        handleChange,
        local,
        deliveryDateIsActivated
    };
};
