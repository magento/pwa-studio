import { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';

import { useCartContext } from '../../../context/cart';

/**
 * Maps address response data from GET_BILLING_ADDRESS and GET_SHIPPING_ADDRESS
 * queries to input names in the billing address form.
 * {@link creditCard.gql.js}.
 *
 * @param {ShippingCartAddress|BillingCartAddress} rawAddressData query data
 */
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
            region: region.code
        };
    } else {
        return {};
    }
};

/**
 * Talon to handle Credit Card payment method.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 * @param {DocumentNode} props.queries.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.queries.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.queries.getPaymentNonceQuery query to fetch payment nonce saved in cache
 * @param {DocumentNode} props.mutations.setBillingAddressMutation mutation to update billing address on the cart
 * @param {DocumentNode} props.mutations.setCreditCardDetailsOnCartMutation mutation to update payment method and payment nonce on the cart
 *
 * @returns {
 *   errors: Map<String, Error>,
 *   shouldRequestPaymentNonce: Boolean,
 *   onPaymentError: Function,
 *   onPaymentSuccess: Function,
 *   onPaymentReady: Function,
 *   isBillingAddressSame: Boolean,
 *   isLoading: Boolean,
 *   stepNumber: Number,
 *   initialValues: {
 *      firstName: String,
 *      lastName: String,
 *      city: String,
 *      postalCode: String,
 *      phoneNumber: String,
 *      street1: String,
 *      street2: String,
 *      country: String,
 *      state: String,
 *      isBillingAddressSame: Boolean
 *   },
 *   shippingAddressCountry: String,
 *   shouldTeardownDropin: Boolean,
 *   resetShouldTeardownDropin: Function
 * }
 */
export const useCreditCard = props => {
    const {
        onSuccess,
        queries,
        mutations,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    } = props;

    const {
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

    const [isDropinLoading, setDropinLoading] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [shouldTeardownDropin, setShouldTeardownDropin] = useState(false);
    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation intiated
     * `2` Braintree nonce requsted
     * `3` Payment information mutation intiated
     * `4` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const client = useApolloClient();
    const formState = useFormState();
    const { validate: validateBillingAddressForm } = useFormApi();
    const [{ cartId }] = useCartContext();

    const isLoading = isDropinLoading || (stepNumber >= 1 && stepNumber <= 3);

    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        skip: !cartId,
        variables: { cartId }
    });
    const { data: shippingAddressData } = useQuery(getShippingAddressQuery, {
        skip: !cartId,
        variables: { cartId }
    });
    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { skip: !cartId, variables: { cartId } }
    );
    const [
        updateBillingAddress,
        {
            error: billingAddressMutationError,
            called: billingAddressMutationCalled,
            loading: billingAddressMutationLoading
        }
    ] = useMutation(setBillingAddressMutation);

    const [
        updateCCDetails,
        {
            error: ccMutationError,
            called: ccMutationCalled,
            loading: ccMutationLoading
        }
    ] = useMutation(setCreditCardDetailsOnCartMutation);

    const shippingAddressCountry = shippingAddressData
        ? shippingAddressData.cart.shippingAddresses[0].country.code
        : 'US';
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    const initialValues = useMemo(() => {
        const isBillingAddressSame = isBillingAddressSameData
            ? isBillingAddressSameData.cart.isBillingAddressSame
            : true;

        let billingAddress = {};
        /**
         * If billing address is same as shipping address, do
         * not auto fill the fields.
         */
        if (billingAddressData && !isBillingAddressSame) {
            if (billingAddressData.cart.billingAddress) {
                const {
                    // eslint-disable-next-line no-unused-vars
                    __typename,
                    ...rawBillingAddress
                } = billingAddressData.cart.billingAddress;
                billingAddress = mapAddressData(rawBillingAddress);
            }
        }

        return { isBillingAddressSame, ...billingAddress };
    }, [isBillingAddressSameData, billingAddressData]);

    /**
     * Helpers
     */

    /**
     * This function sets the boolean isBillingAddressSame
     * in cache for future use. We use cache because there
     * is no way to save this on the cart in remote.
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

    /**
     * This function sets the billing address on the cart using the
     * shipping address.
     */
    const setShippingAddressAsBillingAddress = useCallback(() => {
        const shippingAddress = shippingAddressData
            ? mapAddressData(shippingAddressData.cart.shippingAddresses[0])
            : {};

        updateBillingAddress({
            variables: {
                cartId,
                ...shippingAddress,
                sameAsShipping: true
            }
        });
    }, [updateBillingAddress, shippingAddressData, cartId]);

    /**
     * This function sets the billing address on the cart using the
     * information from the form.
     */
    const setBillingAddress = useCallback(() => {
        const {
            firstName,
            lastName,
            country,
            street1,
            street2,
            city,
            region,
            postalCode,
            phoneNumber
        } = formState.values;

        updateBillingAddress({
            variables: {
                cartId,
                firstName,
                lastName,
                country,
                street1,
                street2,
                city,
                region,
                postalCode,
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

    /**
     * This function sets the payment nonce details in the cache.
     * We use cache because there is no way to save this information
     * on the cart in the remote.
     *
     * We do not save the nonce code because it is a PII.
     */
    const setPaymentDetailsInCache = useCallback(
        braintreeNonce => {
            /**
             * We dont save the nonce code due to PII,
             * we only save the subset of details.
             */
            const { details, description, type } = braintreeNonce;
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

    /**
     * This function saves the nonce code from braintree
     * on the cart along with the payment method used in
     * this case `braintree`.
     */
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

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is successful.
     */
    const onPaymentSuccess = useCallback(
        braintreeNonce => {
            setPaymentDetailsInCache(braintreeNonce);
            /**
             * Updating payment braintreeNonce and selected payment method on cart.
             */
            updateCCDetailsOnCart(braintreeNonce);
            setStepNumber(3);
        },
        [setPaymentDetailsInCache, updateCCDetailsOnCart]
    );

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is not successful.
     */
    const onPaymentError = useCallback(
        error => {
            setStepNumber(0);
            setShouldRequestPaymentNonce(false);
            resetShouldSubmit();
            if (onError) {
                onError(error);
            }
        },
        [onError, resetShouldSubmit]
    );

    /**
     * Function to be called by the braintree dropin when the
     * credit card component has loaded successfully.
     */
    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
        setStepNumber(0);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    /**
     * Function to be called by braintree dropin when the payment
     * teardown is done successfully before re creating the new dropin.
     */
    const resetShouldTeardownDropin = useCallback(() => {
        setShouldTeardownDropin(false);
    }, []);

    /**
     * Effects
     */

    /**
     * Step 1 effect
     *
     * User has clicked the update button
     */
    useEffect(() => {
        try {
            if (shouldSubmit) {
                /**
                 * Validate billing address fields and only process with
                 * submit if there are no errors.
                 *
                 * We do this because the user can click Review Order button
                 * without fillig in all fields and the form submission
                 * happens manually. The informed Form component validates
                 * on submission but that only happens when we use the onSubmit
                 * prop. In this case we are using manually submission because
                 * of the nature of the credit card submission process.
                 */
                validateBillingAddressForm();

                const hasErrors = Object.keys(formState.errors).length;

                if (!hasErrors) {
                    setStepNumber(1);
                    if (isBillingAddressSame) {
                        setShippingAddressAsBillingAddress();
                    } else {
                        setBillingAddress();
                    }
                    setIsBillingAddressSameInCache();
                } else {
                    throw new Error('Errors in the billing address form');
                }
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
        }
    }, [
        shouldSubmit,
        isBillingAddressSame,
        setShippingAddressAsBillingAddress,
        setBillingAddress,
        setIsBillingAddressSameInCache,
        resetShouldSubmit,
        validateBillingAddressForm,
        formState.errors
    ]);

    /**
     * Step 2 effect
     *
     * Billing address mutation has completed
     */
    useEffect(() => {
        try {
            const billingAddressMutationCompleted =
                billingAddressMutationCalled && !billingAddressMutationLoading;

            if (
                billingAddressMutationCompleted &&
                !billingAddressMutationError
            ) {
                /**
                 * Billing address save mutation is successful
                 * we can initiate the braintree nonce request
                 */
                setStepNumber(2);
                setShouldRequestPaymentNonce(true);
            }

            if (
                billingAddressMutationCompleted &&
                billingAddressMutationError
            ) {
                /**
                 * Billing address save mutation is not successful.
                 * Reset update button clicked flag.
                 */
                throw new Error('Billing address mutation failed');
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
        }
    }, [
        billingAddressMutationError,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        resetShouldSubmit
    ]);

    /**
     * Step 3 effect
     *
     * Credit card save mutation has completed
     */
    useEffect(() => {
        /**
         * Saved billing address, payment method and payment nonce on cart.
         *
         * Time to call onSuccess.
         */

        try {
            const ccMutationCompleted = ccMutationCalled && !ccMutationLoading;

            if (ccMutationCompleted && !ccMutationError) {
                if (onSuccess) {
                    onSuccess();
                }
                resetShouldSubmit();
                setStepNumber(4);
            }

            if (ccMutationCompleted && ccMutationError) {
                /**
                 * If credit card mutation failed, reset update button clicked so the
                 * user can click again and set `stepNumber` to 0.
                 */
                throw new Error('Credit card nonce save mutation failed.');
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
            setShouldTeardownDropin(true);
        }
    }, [
        ccMutationCalled,
        ccMutationLoading,
        onSuccess,
        setShouldRequestPaymentNonce,
        resetShouldSubmit,
        ccMutationError
    ]);

    const errors = useMemo(
        () =>
            new Map([
                ['setBillingAddressMutation', billingAddressMutationError],
                ['setCreditCardDetailsOnCartMutation', ccMutationError]
            ]),
        [billingAddressMutationError, ccMutationError]
    );

    return {
        errors,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        isLoading,
        shouldRequestPaymentNonce,
        stepNumber,
        initialValues,
        shippingAddressCountry,
        shouldTeardownDropin,
        resetShouldTeardownDropin
    };
};
