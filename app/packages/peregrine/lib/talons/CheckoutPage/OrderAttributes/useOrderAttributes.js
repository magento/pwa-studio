import { useMemo, useReducer } from 'react';

import { useCartContext } from '../../../context/cart';
import { useMutation } from '@apollo/client';

import DEFAULT_OPERATIONS from './orderAttributes.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const orderAttributesData = {
    comment: null,
    external_order_number: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'comment':
            return { ...state, comment: action.value };
        case 'external_order_number':
            return { ...state, external_order_number: action.value };
        default:
            throw new Error();
    }
}

export const useOrderAttributes = () => {
    const [state, dispatch] = useReducer(reducer, orderAttributesData);
    const [{ cartId }] = useCartContext();
    const { setOrderAttributes } = mergeOperations(DEFAULT_OPERATIONS);

    const handleChangeOrderAttribute = (name, value) => {
        dispatch({ type: name, value });
    };

    const orderAttributesIsActivated = useMemo(() => {
        return Object.keys(state).some(ele => state[ele]);
    }, [state]);

    const [customAttributeQuoteSave] = useMutation(setOrderAttributes);

    const submitOrderAttribute = async () => {
        await customAttributeQuoteSave({
            variables: {
                masked_id: cartId,
                comment: state.comment,
                external_order_number: state.external_order_number
            }
        });
    };

    return { handleChangeOrderAttribute, orderAttributesData: state, submitOrderAttribute, orderAttributesIsActivated };
};
