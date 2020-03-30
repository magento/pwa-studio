import { useCallback } from 'react';
import { useFieldState } from 'informed';
import { useQuery } from '@apollo/react-hooks';

export const useCreditCard = props => {
    const { onSuccess, operations } = props;

    const {
        queries: { getAllCountriesQuery }
    } = operations;

    const { value: addressesDiffer } = useFieldState('addresses_same');

    const onPaymentSuccess = useCallback(
        nonce => {
            console.log('Payment Nonce Received', nonce);
            onSuccess(nonce);
        },
        [onSuccess]
    );

    const onPaymentError = useCallback(error => {
        console.error(error);
    }, []);

    const onPaymentReady = useCallback(data => {
        console.log('payment Ready', data);
    }, []);

    const { data: countriesData } = useQuery(getAllCountriesQuery);

    const { countries } = countriesData || {};

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        addressesDiffer,
        countries
    };
};
