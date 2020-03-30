import { useCallback, useEffect, useState } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useCreditCard = props => {
    const { onSuccess, operations } = props;

    const {
        queries: {
            getAllCountriesQuery,
            getBillingAddressQuery,
            getIsBillingAddressSameQuery
        }
    } = operations;

    const [isDropinLoading, setDropinLoading] = useState(true);

    const formState = useFormState();

    const formApi = useFormApi();

    const client = useApolloClient();

    const [{ cartId }] = useCartContext();

    const { data: countriesData } = useQuery(getAllCountriesQuery);

    const { countries } = countriesData || {};

    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        variables: { cartId }
    });

    const billingAddress = billingAddressData
        ? billingAddressData.cart.billingAddress
        : {};

    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { variables: { cartId } }
    );

    const isBillingAddressSame = isBillingAddressSameData
        ? isBillingAddressSameData.cart.isBillingAddressSame
        : false;

    useEffect(() => {
        if (!isDropinLoading) {
            /**
             * Setting the checkbox to the value in cache
             */
            formApi.setValue('isBillingAddressSame', isBillingAddressSame);

            /**
             * Setting billing address data from cache if
             * `isBillingAddressSame` is `false`
             */
            if (!isBillingAddressSame && billingAddress) {
                // eslint-disable-next-line no-unused-vars
                const { __typename, ...rest } = billingAddress;
                formApi.setValues(rest);
            }
        }
    }, [isBillingAddressSame, formApi, billingAddress, isDropinLoading]);

    const updateIsBillingAddressSame = useCallback(() => {
        const isBillingAddressSame = formState.values.isBillingAddressSame;

        client.writeQuery({
            query: getIsBillingAddressSameQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    isBillingAddressSame
                }
            }
        });
    }, [
        formState.values.isBillingAddressSame,
        client,
        cartId,
        getIsBillingAddressSameQuery
    ]);

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
    }, [formState.values, getBillingAddressQuery, client, cartId]);

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

    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
    }, []);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        updateBillingAddress,
        updateIsBillingAddressSame,
        isLoading: isDropinLoading
    };
};
