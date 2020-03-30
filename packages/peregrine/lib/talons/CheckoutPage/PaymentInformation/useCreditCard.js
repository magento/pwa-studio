import { useCallback, useEffect } from 'react';
import { useFieldState, useFormState } from 'informed';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useCreditCard = props => {
    const { onSuccess, operations } = props;

    const {
        queries: { getAllCountriesQuery, getBillingAddressQuery }
    } = operations;

    const formState = useFormState();

    const [{ cartId }] = useCartContext();

    const { value: addressesDiffer } = useFieldState('isSameAsBillingAddress');

    const [
        getBillingAddress,
        { client, data: billingAddressData }
    ] = useLazyQuery(getBillingAddressQuery);

    useEffect(() => {
        if (cartId) {
            getBillingAddress();
        }
    }, [cartId, getBillingAddress]);

    const updateBillingAddress = useCallback(() => {
        const {
            firstName = '',
            lastName = '',
            street1 = '',
            street2 = '',
            city = '',
            state = '',
            postalCode = '',
            phoneNumber = ''
        } = formState.values;

        client.writeQuery({
            query: getBillingAddressQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    addressesDiffer,
                    billingAddress: {
                        __typename: 'BillingAddress',
                        firstName,
                        lastName,
                        street1,
                        street2,
                        city,
                        state,
                        postalCode,
                        phoneNumber
                    }
                }
            }
        });
    }, [
        formState.values,
        getBillingAddressQuery,
        client,
        cartId,
        addressesDiffer
    ]);

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

    const billingAddress = billingAddressData
        ? billingAddressData.cart.billingAddress
        : {};

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        addressesDiffer,
        countries,
        updateBillingAddress,
        billingAddress
    };
};
