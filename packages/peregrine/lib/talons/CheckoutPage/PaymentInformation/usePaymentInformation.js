import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useFieldState } from 'informed';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {Boolean} props.revewOrderButtonClicked property telling us to proceed to next step
 * @param {Function} props.resetReviewOrderButtonClicked callback to reset the review order button flag
 * @param {DocumentNode} props.queries.getPaymentInformation query to fetch data to render this component
 *
 * @returns {
 *   doneEditing: Boolean,
 *   isEditModalActive: Boolean,
 *   showEditModal: Function,
 *   hideEditModal: Function,
 *   handlePaymentError: Function,
 *   handlePaymentSuccess: Function,
 *   currentSelectedPaymentMethod: String - the UI checkbox selection, not to be confused with the gql value,
 *   checkoutStep: Number,
 *
 * }
 */
export const usePaymentInformation = props => {
    const {
        onSave,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        queries,
        mutations
    } = props;
    const { getPaymentInformation } = queries;
    const { setPaymentMethod } = mutations;

    /**
     * Definitions
     */

    const [doneEditing, setDoneEditing] = useState(false);
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const isEditModalActive = drawer === 'edit.payment';
    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );
    const [{ cartId }] = useCartContext();

    /**
     * Helper Functions
     */

    const showEditModal = useCallback(() => {
        toggleDrawer('edit.payment');
    }, [toggleDrawer]);

    const hideEditModal = useCallback(() => {
        closeDrawer('edit.payment');
    }, [closeDrawer]);

    const handlePaymentSuccess = useCallback(() => {
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const handlePaymentError = useCallback(() => {
        resetReviewOrderButtonClicked();
        setDoneEditing(false);
    }, [resetReviewOrderButtonClicked]);

    /**
     * Queries
     */
    const {
        data: paymentInformationData,
        loading: paymentInformationLoading
    } = useQuery(getPaymentInformation, {
        variables: { cartId }
    });

    const [
        setSelectedPaymentMethod,
        { loading: setPaymentMethodLoading }
    ] = useMutation(setPaymentMethod);
    /**
     * Effects
     */

    // This effect ensures that the "done" card is displayed at the appropriate
    // time.
    useEffect(() => {
        if (paymentInformationData) {
            const { cart } = paymentInformationData;

            const selectedPaymentMethod = cart.selected_payment_method
                ? cart.selected_payment_method.code
                : null;

            if (selectedPaymentMethod === 'free') {
                // Only display "done" card if total is still zero.
                const isZero = cart.prices.grand_total.value === 0;
                setDoneEditing(isZero);
            } else if (selectedPaymentMethod === 'braintree') {
                // Only display "done" card if nonce is found.
                const hasNonce = !!cart.paymentNonce;
                setDoneEditing(hasNonce);
            }
        }
    }, [paymentInformationData]);

    // This effect ensures that the payment method is automatically set to
    // "free" whenever the cart total becomes $0. The GQL server will not accept
    // any other method and we won't be able to submit the cart order.
    useEffect(() => {
        async function handleZeroTotal() {
            if (paymentInformationData) {
                const { cart } = paymentInformationData;

                const cartTotal = cart.prices.grand_total.value;

                if (cartTotal === 0) {
                    await setSelectedPaymentMethod({
                        variables: {
                            cartId,
                            method: {
                                code: 'free'
                            }
                        }
                    });
                }
            }
        }
        handleZeroTotal();
    }, [cartId, paymentInformationData, setSelectedPaymentMethod]);

    // When the checkout page review order button is clicked we can proceed if:
    // a) the payment method is "free".
    // b) the payment method is braintree but we have a previous nonce.
    useEffect(() => {
        if (reviewOrderButtonClicked && paymentInformationData) {
            const { cart } = paymentInformationData;
            const paymentMethod = cart.selected_payment_method
                ? cart.selected_payment_method.code
                : null;

            if (paymentMethod === 'free') {
                // Only proceed to the next step if the total is still zero.
                if (cart.prices.grand_total.value === 0) {
                    onSave();
                }
            } else if (paymentMethod === 'braintree') {
                // Only proceed to the next step if we have a nonce.
                if (cart.paymentNonce) {
                    onSave();
                }
            }
        }
    }, [onSave, paymentInformationData, reviewOrderButtonClicked]);

    return {
        doneEditing,
        isEditModalActive,
        isLoading: paymentInformationLoading || setPaymentMethodLoading,
        showEditModal,
        hideEditModal,
        handlePaymentSuccess,
        handlePaymentError,
        currentSelectedPaymentMethod
    };
};
