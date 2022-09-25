import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '../graphql/deliveryDate.gql';

export const useDeliveryDate = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { GET_DELIVERY_DATES, SET_DELIVERY_TIME } = operations;
    const deliveryDates = useQuery(GET_DELIVERY_DATES);
    const [deliverytime, { error: deliveryTimeError, loading, data: setDeliveryTimeData }] = useMutation(
        SET_DELIVERY_TIME
    );
    const handleAddDeliveryDate = useCallback(
        async (cartId, data) => {
            try {
                deliverytime(cartId, data);
                console.log(setDeliveryTimeData, 'setDeliveryTimeData', deliveryTimeError);
            } catch {
                return;
            }
        },
        [deliverytime]
    );

    return { deliveryDates, handleAddDeliveryDate };
};
