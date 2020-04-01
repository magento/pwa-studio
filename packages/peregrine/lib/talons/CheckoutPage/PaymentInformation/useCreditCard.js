import { useCallback, useEffect, useState } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useCreditCard = props => {
    const { onSuccess, operations, isHidden } = props;
    const {
        queries: {
            getAllCountriesQuery,
            getBillingAddressQuery,
            getIsBillingAddressSameQuery,
            getPaymentNonceQuery
        }
    } = operations;

    /**
     * Definitions
     */

    const [cacheDataRestored, setCacheDataRestored] = useState(false);
    const [isDropinLoading, setDropinLoading] = useState(true);

    const client = useApolloClient();
    const formState = useFormState();
    const formApi = useFormApi();
    const [{ cartId }] = useCartContext();

    const { data: countriesData } = useQuery(getAllCountriesQuery);
    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        variables: { cartId }
    });
    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { variables: { cartId } }
    );

    const { countries } = countriesData || {};
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    /**
     * Effects
     */

    useEffect(() => {
        /**
         * If credit card component is hidden, reset
         * `cacheDataRestored` to `false` so when the
         * component is selected, data from cache will
         * be used to restore form state.
         */
        if (isHidden) {
            setCacheDataRestored(false);
        }
    }, [isHidden]);

    useEffect(() => {
        /**
         * Perform UI restoration only if all of the below are true
         * 1. Credit card component is not hidden
         * 2. Brain tree drop in is not loading
         * 3. It is the first time
         */
        if (!isHidden && !isDropinLoading && !cacheDataRestored) {
            const billingAddress = billingAddressData
                ? billingAddressData.cart.billingAddress
                : {};

            const isBillingAddressSame = isBillingAddressSameData
                ? isBillingAddressSameData.cart.isBillingAddressSame
                : true;

            /**
             * Setting the checkbox to the value in cache
             */
            formApi.setValue('isBillingAddressSame', isBillingAddressSame);

            /**
             * Setting billing address data from cache
             */
            if (billingAddress) {
                // eslint-disable-next-line no-unused-vars
                const { __typename, ...rest } = billingAddress;
                formApi.setValues(rest);
            }

            /**
             * Setting so this effect will not be applied on every render
             */
            setCacheDataRestored(true);
        }
    }, [
        cacheDataRestored,
        isBillingAddressSameData,
        formApi,
        billingAddressData,
        isDropinLoading,
        isHidden
    ]);

    /**
     * Helpers
     */

    const setIsBillingAddressSame = useCallback(() => {
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
    }, [client, cartId, getIsBillingAddressSameQuery, isBillingAddressSame]);

    const setBillingAddress = useCallback(() => {
        const {
            firstName = '',
            lastName = '',
            country = '',
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
                        country,
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

    const setPaymentNonce = useCallback(
        paymentNonce => {
            client.writeQuery({
                query: getPaymentNonceQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        paymentNonce
                    }
                }
            });
        },
        [cartId, client, getPaymentNonceQuery]
    );

    const onPaymentSuccess = useCallback(
        nonce => {
            setBillingAddress();
            setIsBillingAddressSame();
            setPaymentNonce(nonce);
            onSuccess(nonce);
        },
        [onSuccess, setPaymentNonce, setBillingAddress, setIsBillingAddressSame]
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
        isDropinLoading
    };
};
