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
        setDoneEditing(true);
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

    const selectedPaymentMethod = paymentInformationData
        ? paymentInformationData.cart.selected_payment_method.code
        : null;

    const isTotalZero = paymentInformationData
        ? paymentInformationData.cart.prices.grand_total.value === 0
        : false;

    // const hasBraintreeNonce = paymentInformationData
    //     ? !!paymentInformationData.cart.paymentNonce
    //     : null;

    // This effect ensures that the "done" card is displayed at the appropriate
    // time.
    useEffect(() => {
        if (selectedPaymentMethod) {
            if (selectedPaymentMethod === 'free') {
                // Only display "done" card if total is still zero.
                setDoneEditing(isTotalZero);
            } else if (selectedPaymentMethod === 'braintree') {
                /**
                 * Uncommenting below will cause the page to display submitted
                 * CC UI data (last four + name) after refreshing. It will also
                 * cause the `handlePaymentSuccess` method to become unused
                 * as this effect will unmount the CC component before it can
                 * invoke the callback.
                 **/
                // setDoneEditing(hasBraintreeNonce);
                // onSave();
            }
        }
    }, [isTotalZero, onSave, selectedPaymentMethod]);

    // This effect ensures that the payment method is automatically set to
    // "free" whenever the cart total becomes $0. The GQL server will not accept
    // any other method and we won't be able to submit the cart order.
    useEffect(() => {
        async function handleZeroTotal() {
            if (isTotalZero && selectedPaymentMethod !== 'free') {
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
        handleZeroTotal();
    }, [cartId, isTotalZero, selectedPaymentMethod, setSelectedPaymentMethod]);

    // Normally the Review Order button fires off the "submission" of the selected
    // payment method. However, "free" is automatically applied so we have an
    // effect that handles Review Order clicks for it.
    useEffect(() => {
        if (reviewOrderButtonClicked && selectedPaymentMethod) {
            if (selectedPaymentMethod === 'free') {
                // Since `selectedPaymentMethod` is not actually set on non-free
                // carts until submission is successful (ie braintree) we have
                // to gate this `onSave` call. You could get here after adding
                // an item to a cart that was previously free.
                if (isTotalZero) {
                    onSave();
                }
            }
        }
    }, [isTotalZero, onSave, reviewOrderButtonClicked, selectedPaymentMethod]);

    // We must wait for payment method to be set if this is the first time we
    // are hitting this component and the total is $0. If we don't wait then
    // the CC component will mount while the setPaymentMethod mutation is in flight.
    const isLoading = paymentInformationLoading || setPaymentMethodLoading;

    return {
        doneEditing,
        isEditModalActive,
        isLoading,
        showEditModal,
        hideEditModal,
        handlePaymentSuccess,
        handlePaymentError,
        currentSelectedPaymentMethod
    };
};
