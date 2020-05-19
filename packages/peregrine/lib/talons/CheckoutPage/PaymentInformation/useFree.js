import { useEffect } from 'react';

export const useFree = props => {
    const { onSuccess, shouldSubmit } = props;

    useEffect(() => {
        if (shouldSubmit) {
            /**
             * TODO
             *
             * Call setSelectedPaymentMethod mutation with free
             */
            onSuccess();
        }
    }, [onSuccess, shouldSubmit]);
};
