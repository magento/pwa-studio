import { useCallback, useRef, useState } from 'react';
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
    const { queries } = props;
    const { getGiftOptionsQuery } = queries;

    const [{ cartId }] = useCartContext();
    const { cache } = useApolloClient();

    // The form will be a child, not a parent, so we can't call `useFormApi`.
    // Need to use a ref and `props.getApi` instead.
    const formApiRef = useRef();
    const [hasHydrated, setHasHydrated] = useState(false);

    // Could be an effect, but a callback should be slightly better.
    const handleCompleted = useCallback(
        data => {
            // Only write values to the form once, ideally before user input.
            // Afterward, treat client state as the single source of truth.
            if (data && !hasHydrated) {
                formApiRef.current.setValues({
                    cardMessage: data.cart.local_gift_message,
                    includeGiftReceipt: data.cart.include_gift_receipt,
                    includePrintedCard: data.cart.include_printed_card
                });

                setHasHydrated(true);
            }
        },
        [hasHydrated, setHasHydrated]
    );

    const handleValueChange = useCallback(
        values => {
            // Write values to the cache after every user input.
            // Apollo should batch these writes if the user inputs quickly.
            cache.writeQuery({
                query: getGiftOptionsQuery,
                variables: {
                    cart_id: cartId
                },
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        include_gift_receipt: !!values.includeGiftReceipt,
                        include_printed_card: !!values.includePrintedCard,
                        local_gift_message: values.cardMessage || ''
                    }
                }
            });
        },
        [cartId, cache, getGiftOptionsQuery]
    );

    useQuery(getGiftOptionsQuery, {
        onCompleted: handleCompleted,
        skip: !cartId,
        variables: { cartId }
    });

    const cardMessageProps = {
        field: 'cardMessage',
        initialValue: '',
        keepState: true
    };

    const giftReceiptProps = {
        field: 'includeGiftReceipt',
        initialValue: false
    };

    const printedCardProps = {
        field: 'includePrintedCard',
        initialValue: false
    };

    const optionsFormProps = {
        getApi: api => {
            formApiRef.current = api;
        },
        onValueChange: handleValueChange
    };

    const shouldPromptForMessage = useCallback(
        ({ values }) => values.includePrintedCard,
        []
    );

    return {
        cardMessageProps,
        giftReceiptProps,
        optionsFormProps,
        printedCardProps,
        shouldPromptForMessage
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
 * @property {object} cardMessageProps Props for the `cardMessage` textarea element.
 * @property {object} giftReceiptProps Props for the `includeGiftReceipt` checkbox element.
 * @property {object} optionsFormProps Props for the form element.
 * @property {object} printedCardProps Props for the `includePrintedCard` checkbox element.
 * @property {function} shouldPromptForMessage Determines whether to show the `cardMessage` textarea element.
 *
 */
