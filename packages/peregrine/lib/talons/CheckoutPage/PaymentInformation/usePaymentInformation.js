import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

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
 *   checkoutStep: Number,
 *
 * }
 */
export const usePaymentInformation = props => {
    const {
        mutations,
        onSave,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        queries
    } = props;
    const { setPaymentMethodMutation } = mutations;
    const { getPaymentInformation } = queries;

    /**
     * Definitions
     */

    const [doneEditing, setDoneEditing] = useState(false);
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const isEditModalActive = drawer === 'edit.payment';
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
    const [setPaymentMethod] = useMutation(setPaymentMethodMutation);
    /**
     * Effects
     */

    const availablePaymentMethods = paymentInformationData
        ? paymentInformationData.cart.available_payment_methods
        : [];

    const selectedPaymentMethod =
        (paymentInformationData &&
            paymentInformationData.cart.selected_payment_method.code) ||
        null;

    // Whenever available methods change we should reset to the editing view
    // so that a user can see the newly available methods. This could occur
    // if a user causes their cart total to become $0. Additionally, the
    // current pattern requires that the method components themselves
    // indicate their "done" state so we must leave it to them to revert
    // this effect downstream.
    useEffect(() => {
        setDoneEditing(false);
    }, [availablePaymentMethods]);

    // Along the lines of the above effect, since we don't have a "free method"
    // component we check if free is available and set it as the selected method
    // directly. What results is a potential flash of selectable payment methods
    // and then the "free" summary.
    useEffect(() => {
        const setFreeIfAvailable = async () => {
            const freeIsAvailable = !!availablePaymentMethods.find(
                ({ code }) => code === 'free'
            );
            if (freeIsAvailable) {
                if (selectedPaymentMethod !== 'free') {
                    await setPaymentMethod({
                        variables: {
                            cartId,
                            method: {
                                code: 'free'
                            }
                        }
                    });
                }
                // If free is already selected we can just display the summary.
                setDoneEditing(true);
            }
        };
        setFreeIfAvailable();
    }, [
        availablePaymentMethods,
        cartId,
        selectedPaymentMethod,
        setDoneEditing,
        setPaymentMethod
    ]);

    // Handle the case where the review button gets clicked but we already
    // have data (like a refreshed checkout).
    useEffect(() => {
        if (reviewOrderButtonClicked && doneEditing) {
            onSave();
        }
    });

    // We must wait for payment method to be set if this is the first time we
    // are hitting this component and the total is $0. If we don't wait then
    // the CC component will mount while the setPaymentMethod mutation is in flight.
    const isLoading = paymentInformationLoading;

    return {
        doneEditing,
        isEditModalActive,
        isLoading,
        setDoneEditing,
        showEditModal,
        hideEditModal,
        handlePaymentSuccess,
        handlePaymentError
    };
};
