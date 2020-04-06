import { useCallback, useEffect, useState } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

/**
 * Talon to handle Credit Card payment method.
 *
 * @param {Boolean} props.isHidden boolean value which represents if the component is hidden or not
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {DocumentNode} props.operations.queries.getAllCountriesQuery query to fetch all countries data
 * @param {DocumentNode} props.operations.queries.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.operations.queries.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.operations.queries.getPaymentNonceQuery query to fetch payment nonce saved in cache
 *
 * @returns {
 *   onPaymentError: Function,
 *   onPaymentSuccess: Function,
 *   onPaymentReady: Function,
 *   isBillingAddressSame: Boolean,
 *   countries: Object,
 *   isDropinLoading: Boolean
 * }
 */
export const useCreditCard = props => {
    const { onSuccess, operations, isHidden, onReady, onError } = props;
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
         *
         * Similarly reset `isDropinLoading` to `true`
         * so when the component is selected, till the
         * braintree drop in ready, a loading state will
         * be shown.
         */
        if (isHidden) {
            setCacheDataRestored(false);
            setDropinLoading(true);
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
            if (onSuccess) {
                onSuccess(nonce);
            }
        },
        [onSuccess, setPaymentNonce, setBillingAddress, setIsBillingAddressSame]
    );

    const onPaymentError = useCallback(
        error => {
            if (onError) {
                onError(error);
            }
        },
        [onError]
    );

    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading
    };
};
