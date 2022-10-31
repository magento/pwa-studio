import { useMemo, useReducer } from 'react';
import DEFAULT_OPERATIONS from '../graphql/orderAttributes.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation, useQuery } from '@apollo/client';
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
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [{ cartId }] = useCartContext();
    console.log(operations, 'DEFAULT_OPERATIONS');
    const { setOrderAttributes } = operations;

    const handleChangeOrderAttribute = (name, value) => {
        dispatch({ type: name, value });
    };
    const orderAttributesIsActivated = useMemo(() => {
        return Object.keys(state).some(ele => state[ele]);
    }, [state]);
    const [customAttributeQuoteSave, { error, loading, data }] = useMutation(setOrderAttributes);

    const submitOrderAttribute = async data => {
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
