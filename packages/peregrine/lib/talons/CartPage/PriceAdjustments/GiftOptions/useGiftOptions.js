import { useCallback, useRef, useEffect } from 'react';
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
 * @param {GiftOptionsMutations} props.mutations GraphQL mutations for Gift Options
 * @param {GiftOptionsQueries} props.queries GraphQL queries for Gift Options
 *
 * @returns {GiftOptionsTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';
 */
const useGiftOptions = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        setGiftOptionsOnCartMutation,
        getGiftOptionsOnCartQuery
    } = operations;

    const [{ cartId }] = useCartContext();

    // The form will be a child, not a parent, so we can't call `useFormApi`.
    // Need to use a ref and `props.getApi` instead.
    const formApiRef = useRef();

    const [setGiftOptionsOnCart] = useMutation(setGiftOptionsOnCartMutation);
    const { data: getGiftOptionsData, loading } = useQuery(
        getGiftOptionsOnCartQuery,
        {
            variables: { cartId },
            fetchPolicy: 'cache-and-network'
        }
    );

    useEffect(() => {
        if ((!loading, getGiftOptionsData)) {
            const { cart } = getGiftOptionsData;
            const { from, to, message } = cart.gift_message || {};

            formApiRef.current.setValues({
                cardFrom: from,
                cardTo: to,
                cardMessage: message,
                includeGiftReceipt: cart.include_gift_receipt,
                includePrintedCard: cart.include_printed_card
            });
        }
    }, [getGiftOptionsData, loading]);

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
                        giftReceiptIncluded: false,
                        printedCardIncluded: false
                    }
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, setGiftOptionsOnCart]
    );

    const giftReceiptProps = {
        field: 'includeGiftReceipt',
        initialValue: false
    };

    const printedCardProps = {
        field: 'includePrintedCard',
        initialValue: false
    };

    const cardToProps = {
        field: 'cardTo',
        initialValue: '',
        keepState: true
    };

    const cardFromProps = {
        field: 'cardFrom',
        initialValue: '',
        keepState: true
    };

    const cardMessageProps = {
        field: 'cardMessage',
        initialValue: '',
        keepState: true
    };

    const optionsFormProps = {
        getApi: api => {
            formApiRef.current = api;
        },
        // Batch writes if the user inputs quickly.
        onValueChange: debounce(handleValueChange, 500)
    };

    return {
        giftReceiptProps,
        printedCardProps,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        optionsFormProps
    };
};

export default useGiftOptions;

/** JSDocs type definitions */

/**
 * GraphQL mutations for Gift Options
 *
 * @typedef {Object} GiftOptionsMutations
 *
 * @property {GraphQLAST} setGiftOptionsMutation Mutation to use for setting the gift options for the cart
 *
 * @see [giftOptions.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.gql.js}
 * for the query Venia uses.
 */

/**
 * GraphQL query for Gift Options
 *
 * @typedef {Object} GiftOptionsQueries
 *
 * @property {GraphQLAST} getGiftOptionsQuery Query to get gift options data
 *
 * @see [giftOptions.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.gql.js}
 * for the query Venia uses.
 */

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
