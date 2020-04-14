import { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const mapAddressData = rawAddressData => {
    if (rawAddressData) {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            street,
            country,
            region
        } = rawAddressData;

        return {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
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
 * @param {Boolean} props.updateButtonClicked boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {Function} props.resetUpdateButtonClicked callback to reset the updateButtonClicked flag
 * @param {DocumentNode} props.queries.getAllCountriesQuery query to fetch all countries data
 * @param {DocumentNode} props.queries.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.queries.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.queries.getPaymentNonceQuery query to fetch payment nonce saved in cache
 * @param {DocumentNode} props.mutations.setBillingAddressMutation mutation to update billing address on the cart
 * @param {DocumentNode} props.mutations.setCreditCardDetailsOnCartMutation mutation to update payment method and payment nonce on the cart
 *
 * @returns {
 *   shouldRequestPaymentNonce: Boolean,
 *   onPaymentError: Function,
 *   onPaymentSuccess: Function,
 *   onPaymentReady: Function,
 *   isBillingAddressSame: Boolean,
 *   countries: Object,
 *   isDropinLoading: Boolean,
 *   errors: Array<String>,
 *   stepNumber: Number
 * }
 */
export const useCreditCard = props => {
    const {
        onSuccess,
        queries,
        mutations,
        isHidden,
        onReady,
        onError,
        updateButtonClicked,
        resetUpdateButtonClicked
    } = props;
    const {
        getAllCountriesQuery,
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getPaymentNonceQuery,
        getShippingAddressQuery
    } = queries;
    const {
        setBillingAddressMutation,
        setCreditCardDetailsOnCartMutation
    } = mutations;

    /**
     * Definitions
     */

    const [cacheDataRestored, setCacheDataRestored] = useState(false);
    const [isDropinLoading, setDropinLoading] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation intiated
     * `2` Billing address mutation completed
     * `3` Braintree nonce requsted
     * `4` Braintree nonce received
     * `5` Payment information mutation intiated
     * `6` Payment information mutation completed
     * `7` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const client = useApolloClient();
    const formState = useFormState();
    const formApi = useFormApi();
    const [{ cartId }] = useCartContext();

    const { data: countriesData } = useQuery(getAllCountriesQuery);
    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        variables: { cartId }
    });
    const { data: shippingAddressData } = useQuery(getShippingAddressQuery, {
        variables: { cartId }
    });
    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { variables: { cartId } }
    );
    const [
        updateBillingAddress,
        {
            error: billingAddressMutationErrors,
            called: billingAddressMutationCalled,
            loading: billingAddressMutationLoading
        }
    ] = useMutation(setBillingAddressMutation);
    const [
        updateCCDetails,
        {
            error: ccMutationErrors,
            called: ccMutationCalled,
            loading: ccMutationLoading
        }
    ] = useMutation(setCreditCardDetailsOnCartMutation);

    const { countries } = countriesData || {};
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    const errors = useMemo(() => {
        const errors = [];

        if (ccMutationErrors) {
            ccMutationErrors.graphQLErrors.forEach(({ message }) => {
                errors.push(message);
            });
        }
        if (billingAddressMutationErrors) {
            billingAddressMutationErrors.graphQLErrors.forEach(
                ({ message }) => {
                    errors.push(message);
                }
            );
        }

        return errors;
    }, [ccMutationErrors, billingAddressMutationErrors]);

    /**
     * Helpers
     */

    const setIsBillingAddressSameInCache = useCallback(() => {
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

    const setShippingAddressAsBillingAddress = useCallback(() => {
        const shippingAddress = shippingAddressData
            ? mapAddressData(shippingAddressData.cart.shippingAddresses[0])
            : {};
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
        } = shippingAddress;

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
                phoneNumber,
                sameAsShipping: true
            }
        });
    }, [updateBillingAddress, shippingAddressData, cartId]);

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
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

    const setPaymentDetailsInCache = useCallback(
        paymentNonce => {
            /**
             * We dont save the nonce due to PII
             */
            const { details, description, type } = paymentNonce;
            client.writeQuery({
                query: getPaymentNonceQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        paymentNonce: {
                            details,
                            description,
                            type
                        }
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
            setPaymentDetailsInCache(nonce);
            /**
             * Updating payment nonce and selected payment method on cart.
             */
            updateCCDetailsOnCart(nonce);
            setStepNumber(5);
        },
        [setPaymentDetailsInCache, updateCCDetailsOnCart]
    );

    const onPaymentError = useCallback(
        error => {
            setStepNumber(0);
            if (onError) {
                onError(error);
            }
        },
        [onError]
    );

    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
        setStepNumber(0);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

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
             * Setting billing address data
             */
            if (billingAddressData) {
                if (billingAddressData.cart.billingAddress) {
                    const billingAddress = mapAddressData(
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

    useEffect(() => {
        if (updateButtonClicked) {
            if (isBillingAddressSame) {
                setShippingAddressAsBillingAddress();
            } else {
                setBillingAddress();
            }
            setStepNumber(1);
            setIsBillingAddressSameInCache();
        }
    }, [
        updateButtonClicked,
        isBillingAddressSame,
        setShippingAddressAsBillingAddress,
        setBillingAddress,
        setIsBillingAddressSameInCache
    ]);

    useEffect(() => {
        const billingAddressMutationCompleted =
            billingAddressMutationCalled && !billingAddressMutationLoading;
        if (billingAddressMutationCompleted && !billingAddressMutationErrors) {
            /**
             * Billing address save mutation is successful
             * we can initiate the braintree nonce request
             */
            setStepNumber(3);
            setShouldRequestPaymentNonce(true);
        }

        if (billingAddressMutationCompleted && billingAddressMutationErrors) {
            /**
             * Billing address save mutation is not successful.
             * Reset update button clicked flag.
             */
            setStepNumber(0);
            resetUpdateButtonClicked();
            setShouldRequestPaymentNonce(false);
        }
    }, [
        billingAddressMutationErrors,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        resetUpdateButtonClicked
    ]);

    useEffect(() => {
        /**
         * Saved billing address, payment method and payment nonce on cart.
         *
         * Time to call onSuccess.
         */
        if (ccMutationCalled && !ccMutationLoading && errors.length === 0) {
            if (onSuccess) {
                onSuccess();
            }
            setStepNumber(7);
        }

        if (ccMutationCalled && !ccMutationLoading && errors.length) {
            /**
             * If credit card mutation failed, reset update button clicked so the
             * user can click again and set `stepNumber` to 0.
             */
            setStepNumber(0);
            resetUpdateButtonClicked();
            setShouldRequestPaymentNonce(false);
        }
    }, [
        ccMutationCalled,
        ccMutationLoading,
        errors,
        onSuccess,
        setShouldRequestPaymentNonce,
        resetUpdateButtonClicked
    ]);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading,
        errors,
        shouldRequestPaymentNonce,
        stepNumber
    };
};
