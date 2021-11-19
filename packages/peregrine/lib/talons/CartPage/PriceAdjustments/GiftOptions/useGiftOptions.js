import { useCallback, useEffect, useMemo } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
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
 * @param {Boolean} props.shouldSubmit property telling us to submit data
 * @param {GiftOptionsOperations} props.operations
 *
 * @returns {GiftOptionsTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';
 */
export const useGiftOptions = props => {
    const { shouldSubmit } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { setGiftOptionsOnCartMutation, getGiftOptionsQuery } = operations;

    const [{ cartId }] = useCartContext();

    const client = useApolloClient();
    const [setGiftOptionsOnCart] = useMutation(setGiftOptionsOnCartMutation);
    const { data: getGiftOptionsData, loading } = useQuery(
        getGiftOptionsQuery,
        {
            variables: { cartId }
        }
    );

    const { cart } = getGiftOptionsData || {};

    const formValues = useMemo(
        () => ({
            cardFrom: cart?.gift_message?.from || '',
            cardTo: cart?.gift_message?.to || '',
            cardMessage: cart?.gift_message?.message || '',
            includeGiftReceipt: cart?.gift_receipt_included === true,
            includePrintedCard: cart?.printed_card_included === true
        }),
        [cart]
    );

    const handleValueChange = useCallback(
        values => {
            // Save data in cache until we submit it on Review Order
            client.writeQuery({
                query: getGiftOptionsQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        gift_message: {
                            to: values.cardTo || '',
                            from: values.cardFrom || '',
                            message: values.cardMessage || ''
                        },
                        gift_receipt_included:
                            values.includeGiftReceipt === true,
                        printed_card_included:
                            values.includePrintedCard === true
                    }
                }
            });
        },
        [cartId, client, getGiftOptionsQuery]
    );

    const handleSubmit = useCallback(() => {
        try {
            setGiftOptionsOnCart({
                variables: {
                    cartId,
                    giftMessage: {
                        to: formValues.cardTo,
                        from: formValues.cardFrom,
                        message: formValues.cardMessage
                    },
                    giftReceiptIncluded: formValues.includeGiftReceipt,
                    printedCardIncluded: formValues.includePrintedCard
                }
            });
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
        }
    }, [
        cartId,
        formValues.cardFrom,
        formValues.cardMessage,
        formValues.cardTo,
        formValues.includeGiftReceipt,
        formValues.includePrintedCard,
        setGiftOptionsOnCart
    ]);

    // Submit data only when we click on "Review Order" in the Checkout Page
    useEffect(() => {
        if (shouldSubmit) {
            handleSubmit();
        }
    }, [handleSubmit, shouldSubmit]);

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
        field: 'cardTo',
        allowEmptyString: true
    };

    const cardFromProps = {
        field: 'cardFrom',
        allowEmptyString: true
    };

    const cardMessageProps = {
        field: 'cardMessage',
        allowEmptyString: true
    };

    const optionsFormProps = {
        initialValues: formValues,
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
