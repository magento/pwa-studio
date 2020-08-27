import { useState, useCallback, useEffect, useMemo } from 'react';
import throttle from 'lodash.throttle';
import { useApolloClient, useQuery } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

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
const useGiftOptions = props => {
    const {
        queries: { getGiftOptionsQuery }
    } = props;
    /**
     * Using local state instead of awaiting data from mutation to avoid
     * weird UX issues generated due to network latency.
     */
    const [includeGiftReceipt, setIncludeGiftReceipt] = useState(false);
    const [includePrintedCard, setIncludePrintedCard] = useState(false);
    const [giftMessage, setGiftMessage] = useState('');
    const apolloClient = useApolloClient();

    const [{ cartId }] = useCartContext();

    const { data } = useQuery(getGiftOptionsQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const updateGiftOptions = useCallback(
        optionsToUpdate => {
            apolloClient.cache.writeQuery({
                query: getGiftOptionsQuery,
                variables: {
                    cart_id: cartId
                },
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        include_gift_receipt: includeGiftReceipt,
                        include_printed_card: includePrintedCard,
                        gift_message: giftMessage,
                        ...optionsToUpdate
                    }
                }
            });
        },
        [
            apolloClient.cache,
            cartId,
            getGiftOptionsQuery,
            giftMessage,
            includeGiftReceipt,
            includePrintedCard
        ]
    );

    /**
     * @ignore
     *
     * Throttling message update. Only make 1 mutation
     * every 1 second. This is to save on bandwidth.
     *
     * More info: https://lodash.com/docs/4.17.15#throttle
     */
    const throttledMessageUpdate = useMemo(() => {
        return throttle(
            (updateGiftOptions, newGiftMessage) => {
                updateGiftOptions({
                    gift_message: newGiftMessage
                });
            },
            1000,
            {
                leading: false
            }
        );
    }, []);

    const updateGiftMessage = useCallback(
        e => {
            const newGiftMessage = e.target.value;
            setGiftMessage(newGiftMessage);
            throttledMessageUpdate(updateGiftOptions, newGiftMessage);
        },
        [setGiftMessage, throttledMessageUpdate, updateGiftOptions]
    );

    const toggleIncludeGiftReceiptFlag = useCallback(() => {
        setIncludeGiftReceipt(!includeGiftReceipt);
        updateGiftOptions({
            include_gift_receipt: !includeGiftReceipt
        });
    }, [updateGiftOptions, includeGiftReceipt, setIncludeGiftReceipt]);

    const toggleIncludePrintedCardFlag = useCallback(() => {
        setIncludePrintedCard(!includePrintedCard);
        updateGiftOptions({
            include_printed_card: !includePrintedCard
        });
    }, [updateGiftOptions, includePrintedCard, setIncludePrintedCard]);

    /**
     * Once data is available from the query request, update
     * the respective values.
     */
    useEffect(() => {
        if (data) {
            const {
                include_gift_receipt,
                include_printed_card,
                gift_message
            } = data.cart;

            setIncludeGiftReceipt(include_gift_receipt);
            setIncludePrintedCard(include_printed_card);
            setGiftMessage(gift_message);
        }
    }, [setIncludeGiftReceipt, setIncludePrintedCard, data]);

    return {
        includeGiftReceipt,
        includePrintedCard,
        giftMessage,
        toggleIncludeGiftReceiptFlag,
        toggleIncludePrintedCardFlag,
        updateGiftMessage
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
 * @property {boolean} includeGiftReceipt True if a gift receipt should be included. False otherwise.
 * @property {boolean} includePrintedCard True if a printed card should be included. False otherwise.
 * @property {String} giftMessage Message to include with a gift.
 * @property {function} toggleIncludeGiftReceiptFlag Toggles the value of the `includeGiftReceipt` value.
 * @property {function} toggleIncludePrintedCardFlag Toggles the value of the `includePrintedCard` value.
 * @property {function} updateGiftMessage Updates the gift message value.
 *
 */
