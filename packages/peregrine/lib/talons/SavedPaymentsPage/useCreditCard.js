import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from './creditCard.gql';

export const useCreditCard = props => {
    const { paymentHash } = props;

    const operations = mergeOperations(defaultOperations, props.operations);
    const { deleteCreditCardPaymentMutation } = operations;

    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const [deletePayment, { error, loading }] = useMutation(
        deleteCreditCardPaymentMutation
    );

    const handleDeletePayment = useCallback(async () => {
        try {
            await deletePayment({ variables: { paymentHash } });
        } catch {
            setIsConfirmingDelete(false);
        }
    }, [deletePayment, paymentHash]);

    const toggleDeleteConfirmation = useCallback(() => {
        setIsConfirmingDelete(current => !current);
    }, []);

    return {
        handleDeletePayment,
        hasError: !!error,
        isConfirmingDelete,
        isDeletingPayment: loading,
        toggleDeleteConfirmation
    };
};
