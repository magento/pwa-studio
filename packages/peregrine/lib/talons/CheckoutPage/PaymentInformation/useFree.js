import { useEffect } from 'react';

export const useFree = props => {
    const { onSuccess } = props;

    useEffect(() => {
        /**
         * TODO
         *
         * Call setSelectedPaymentMethod mutation with free
         */

        onSuccess();
    }, [onSuccess]);
};
