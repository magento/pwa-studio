import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import debounce from 'lodash.debounce';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './giftOptions.gql';

/**
 * This talon contains the logic for a gift options component.
 * It performs effects and returns a data object containing values for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Fetch the gift options associated with the cart
 * - Update the {@link GiftOptionsTalonProps} values with the data returned by the query
 *
 * @function
 *
 * @param {Object} props
 * @param {GiftOptionsOperations} props.operations
 *
 * @returns {GiftOptionsTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';
 */
export const useGiftOptions = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { setGiftOptionsOnCartMutation, getGiftOptionsQuery } = operations;

    const [{ cartId }] = useCartContext();

    const [setGiftOptionsOnCart] = useMutation(setGiftOptionsOnCartMutation);
    const { data: getGiftOptionsData, loading } = useQuery(
        getGiftOptionsQuery,
        {
            variables: { cartId }
        }
    );

    const { cart } = getGiftOptionsData || {};

    const initialValues = useMemo(() => {
        if (cart) {
            return {
                cardFrom: cart.gift_message?.from || '',
                cardTo: cart.gift_message?.to || '',
                cardMessage: cart.gift_message?.message || '',
                includeGiftReceipt: cart.gift_receipt_included,
                includePrintedCard: cart.printed_card_included
            };
        }
    }, [cart]);

    const handleValueChange = useCallback(
        values => {
            try {
                setGiftOptionsOnCart({
                    variables: {
                        cartId,
                        giftMessage: {
                            to: values.cardTo || '',
                            from: values.cardFrom || '',
                            message: values.cardMessage || ''
                        },
                        giftReceiptIncluded: values.includeGiftReceipt === true,
                        printedCardIncluded: values.includePrintedCard === true
                    }
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, setGiftOptionsOnCart]
    );

    // Batch writes if the user inputs quickly.
    const debouncedOnChange = useMemo(
        () =>
            debounce(value => {
                handleValueChange(value);
            }, 500),
        [handleValueChange]
    );

    const giftReceiptProps = {
        field: 'includeGiftReceipt'
    };

    const printedCardProps = {
        field: 'includePrintedCard'
    };

    const cardToProps = {
        field: 'cardTo'
    };

    const cardFromProps = {
        field: 'cardFrom'
    };

    const cardMessageProps = {
        field: 'cardMessage'
    };

    const optionsFormProps = {
        initialValues: initialValues,
        onValueChange: debouncedOnChange
    };

    return {
        loading,
        giftReceiptProps,
        printedCardProps,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        optionsFormProps
    };
};

/** JSDocs type definitions */

/**
 * Props data to use when rendering a gift options component.
 *
 * @typedef {Object} GiftOptionsTalonProps
 *
 * @property {object} giftReceiptProps Props for the `includeGiftReceipt` checkbox element.
 * @property {object} printedCardProps Props for the `includePrintedCard` checkbox element.
 * @property {object} cardToProps Props for the `cardTo` text input element.
 * @property {object} cardFromProps Props for the `cardFrom` text input element.
 * @property {object} cardMessageProps Props for the `cardMessage` textarea element.
 * @property {object} optionsFormProps Props for the form element.
 */

/**
 * This is a type used by the {@link useGiftOptions} talon.
 *
 * @typedef {Object} GiftOptionsOperations
 *
 * @property {GraphQLAST} setGiftOptionsOnCartMutation sets the gift options on cart.
 * @property {GraphQLAST} getGiftOptionsQuery fetch the gift options.
 */
