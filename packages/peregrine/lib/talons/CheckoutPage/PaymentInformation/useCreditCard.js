import { useCallback, useEffect, useState } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

const mapBillingAddressData = rawBillingAddressData => {
    if (rawBillingAddressData) {
        const { street, country, region } = rawBillingAddressData;

        return {
            ...rawBillingAddressData,
            street1: street[0],
            street2: street[1],
            country: country.code,
            state: region.code
        };
    } else {
        return {};
    }
};

/**
 * Talon to handle Credit Card payment method.
 *
 * @param {Boolean} props.isHidden boolean value which represents if the component is hidden or not
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {DocumentNode} props.queries.getAllCountriesQuery query to fetch all countries data
 * @param {DocumentNode} props.queries.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.queries.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.queries.getPaymentNonceQuery query to fetch payment nonce saved in cache
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
    const { onSuccess, queries, mutations, isHidden, onReady, onError } = props;
    const {
        getAllCountriesQuery,
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getPaymentNonceQuery
    } = queries;
    const { setBillingAddressMutation, setCreditCardDetailsOnCart } = mutations;

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
    const [updateBillingAddress] = useMutation(setBillingAddressMutation);
    const [updateCCDetails] = useMutation(setCreditCardDetailsOnCart);

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
            /**
             * Setting the checkbox to the value in cache
             */
            const isBillingAddressSame = isBillingAddressSameData
                ? isBillingAddressSameData.cart.isBillingAddressSame
                : true;

            formApi.setValue('isBillingAddressSame', isBillingAddressSame);

            /**
             * Setting billing address data from cache
             */
            if (billingAddressData) {
                if (billingAddressData.cart.billingAddress) {
                    const billingAddress = mapBillingAddressData(
                        billingAddressData.cart.billingAddress
                    );
                    // eslint-disable-next-line no-unused-vars
                    const { __typename, ...rest } = billingAddress;
                    formApi.setValues(rest);
                }
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

        updateBillingAddress({
            variables: {
                cartId,
                firstName,
                lastName,
                street1,
                street2,
                city,
                state,
                postalCode,
                country,
                phoneNumber
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

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

    const updateCCDetailsOnCart = useCallback(
        braintreeNonce => {
            const { nonce } = braintreeNonce;
            updateCCDetails({
                variables: {
                    cartId,
                    paymentMethod: 'braintree',
                    paymentNonce: nonce
                }
            });
        },
        [updateCCDetails, cartId]
    );

    const onPaymentSuccess = useCallback(
        nonce => {
            /**
             * TODO
             * Ideally if the billing address is same as
             * shipping address, we have to fetch shipping
             * address and use it to save billing address.
             *
             * But I have some doubts about shipping addresses.
             * Till those get rectified, ill have to wait :(
             */
            if (!isBillingAddressSame) {
                setBillingAddress();
            }
            /**
             * Ideally all these have to move to the cart as well.
             */
            setIsBillingAddressSame();
            /**
             * This needs to happen on the cart and we should call onSuccess
             * only when the mutation on cart is successful.
             *
             * And we need to check for errors.
             */
            setPaymentNonce(nonce);
            updateCCDetailsOnCart(nonce);
            if (onSuccess) {
                onSuccess(nonce);
            }
        },
        [
            onSuccess,
            setPaymentNonce,
            setBillingAddress,
            setIsBillingAddressSame,
            updateCCDetailsOnCart,
            isBillingAddressSame
        ]
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
