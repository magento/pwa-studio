import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {DocumentNode} props.operations.queries.getSelectedPaymentMethodQuery query to get the selected payment method value from cache
 * @param {DocumentNode} props.operations.queries.getPaymentNonceQuery query to get the payment nonce from cache
 *
 * @returns {
 *   doneEditing: Boolean,
 *   shouldRequestPaymentNonce: Boolean,
 *   isEditModalHidden: Boolean,
 *   selectedPaymentMethod: String,
 *   paymentNonce: {
 *      nonce: String,
 *      type: String,
 *      description: String,
 *      details: {
 *          cardType: String,
 *          lastFour: String,
 *          lastTwo: String
 *      },
 *      binData: {
 *          prepaid: String,
 *          healthcare: String,
 *          debit: String,
 *          durbinRegulated: String,
 *          commercial: String,
 *          payroll: String,
 *          issuingBank: String,
 *          countryOfIssuance: String,
 *          productId: String
 *      }
 *   },
 *   handleReviewOrder: Function,
 *   showEditModal: Function,
 *   hideEditModal: Function
 *
 * }
 */
export const usePaymentInformation = props => {
    const { onSave, operations } = props;
    const {
        queries: { getSelectedPaymentMethodQuery, getPaymentNonceQuery }
    } = operations;

    /**
     * Definitions
     */

    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [isEditModalHidden, setIsEditModalHidden] = useState(true);
    const [, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    /**
     * Query Fetches
     */

    const { data: selectedPaymentMethodData } = useQuery(
        getSelectedPaymentMethodQuery,
        {
            variables: {
                cartId
            }
        }
    );

    const { data: paymentNonceData } = useQuery(getPaymentNonceQuery, {
        variables: {
            cartId
        }
    });

    const selectedPaymentMethod = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selectedPaymentMethod
        : null;

    const paymentNonce = paymentNonceData
        ? paymentNonceData.cart.paymentNonce
        : null;

    /**
     * Helper Functions
     */

    const handleReviewOrder = useCallback(() => {
        setShouldRequestPaymentNonce(true);
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const showEditModal = useCallback(() => {
        toggleDrawer('edit.payment');
        setIsEditModalHidden(false);
    }, [setIsEditModalHidden, toggleDrawer]);

    const hideEditModal = useCallback(() => {
        setIsEditModalHidden(true);
        closeDrawer('edit.payment');
    }, [setIsEditModalHidden, closeDrawer]);

    return {
        doneEditing: !!paymentNonce,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        selectedPaymentMethod,
        paymentNonce,
        isEditModalHidden,
        showEditModal,
        hideEditModal
    };
};
