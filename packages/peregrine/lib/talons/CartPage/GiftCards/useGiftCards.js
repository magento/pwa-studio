import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

// The prompt is either actually showing the entry form or
// showing an "add" call to action button.
const promptStates = {
    ADD: 'add',
    ENTERING: 'entering'
};

// To keep track of the most recent action taken.
const actions = {
    APPLY: 'apply',
    CHECK_BALANCE: 'check',
    REMOVE: 'remove',
    TOGGLE: 'toggle'
};

const getPromptStateForNumCards = numCards =>
    numCards === 0 ? promptStates.ENTERING : promptStates.ADD;

/**
 * The useGiftCards talon handles effects for GiftCards and returns props necessary for rendering
 * the GiftCards component.
 *
 * @param {Object}     props
 * @param {GraphQLAST} props.applyCardMutation - The mutation used to apply a gift card to the cart.
 * @param {GraphQLAST} props.cardBalanceQuery - The query used to get the balance of a gift card.
 * @param {GraphQLAST} props.cartQuery - The query used to get the gift cards currently applied to the cart.
 * @param {GraphQLAST} props.removeCardMutation - The mutation used to remove a gift card from the cart.
 *
 * @returns {Object}    result
 * @returns {Boolean}   result.canTogglePromptState - Whether the user should be allowed to switch the prompt state.
 * @returns {Object}    result.checkBalanceData - The giftCardAccount object of the most recent successful check balance GraphQL query.
 * @returns {Boolean}   result.errorLoadingGiftCards - Whether there was an error loading the cart's gift cards.
 * @returns {Boolean}   result.errorApplyingCard - Whether there was an error applying the gift card.
 * @returns {Boolean}   result.errorCheckingBalance - Whether there was an error checking the balance of the gift card.
 * @returns {Boolean}   result.errorRemovingCard - Whether there was an error removing the gift card.
 * @returns {Array}     result.giftCardsData - The applied_gift_cards object of the cart query.
 * @returns {Function}  result.handleApplyCard - A callback to apply a gift card to the cart.
 * @returns {Function}  result.handleCheckCardBalance - A callback to check the balance of a gift card.
 * @returns {Function}  result.handleRemoveCard - A callback to remove a gift card from the cart.
 * @returns {Function}  result.handleTogglePromptState - A callback to toggle the prompt state.
 * @returns {Boolean}   result.isLoadingGiftCards - Whether the cart's gift card data is loading.
 * @returns {Boolean}   result.isApplyingCard - Whether the apply gift card operation is in progress.
 * @returns {Boolean}   result.isCheckingBalance - Whether the check gift card balance operation is in progress.
 * @returns {Boolean}   result.isRemovingCard - Whether the remove gift card operation is in progress.
 * @returns {Boolean}   result.shouldDisplayCardBalance - Whether to display the gift card balance to the user.
 * @returns {Boolean}   result.shouldDisplayCardEntry - Whether to display the gift card entry form.
 */
export const useGiftCards = props => {
    const {
        applyCardMutation,
        cardBalanceQuery,
        cartQuery,
        removeCardMutation
    } = props;

    // We need the cartId for all of our queries and mutations.
    const [{ cartId }] = useCartContext();

    /*
     * Apollo hooks.
     *
     * Immediately execute the cart query and set up the other graphql actions.
     */
    const cartResult = useQuery(cartQuery, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network'
    });
    const [checkCardBalance, balanceResult] = useLazyQuery(cardBalanceQuery);
    const [applyCard, applyCardResult] = useMutation(applyCardMutation);
    const [removeCard, removeCardResult] = useMutation(removeCardMutation);

    /*
     * useMemo hooks / member variables.
     */
    const numCards = useMemo(() => {
        return cartResult.data
            ? cartResult.data.cart.applied_gift_cards.length
            : Number.NEGATIVE_INFINITY;
    }, [cartResult.data]);

    const canTogglePromptState = numCards > 0;
    const initialPromptState = getPromptStateForNumCards(numCards);

    /*
     *  useState hooks.
     */
    const [mostRecentAction, setMostRecentAction] = useState(null);
    const [promptState, setPromptState] = useState(initialPromptState);
    // const [shouldDisplayCardError, setShouldDisplayCardError] = useState(false);

    /*
     *  useEffect hooks.
     */
    // Update the prompt state whenever the number of cards changes.
    useEffect(() => {
        const targetPromptState = getPromptStateForNumCards(numCards);
        setPromptState(targetPromptState);
    }, [numCards]);

    /*
     * useCallback hooks.
     */
    const handleApplyCard = useCallback(
        async giftCardCode => {
            try {
                await applyCard({
                    variables: {
                        cartId,
                        giftCardCode
                    }
                });
            } catch (err) {
                // do nothing
            } finally {
                setMostRecentAction(actions.APPLY);
            }
        },
        [applyCard, cartId]
    );

    const handleCheckCardBalance = useCallback(
        giftCardCode => {
            // Don't cache this one because the card can be used elsewhere.
            checkCardBalance({
                fetchPolicy: 'no-cache',
                variables: { giftCardCode }
            });

            setMostRecentAction(actions.CHECK_BALANCE);
        },
        [checkCardBalance]
    );

    const handleRemoveCard = useCallback(
        async giftCardCode => {
            try {
                await removeCard({
                    variables: {
                        cartId,
                        giftCardCode
                    }
                });
            } catch (err) {
                // do nothing
            } finally {
                setMostRecentAction(actions.REMOVE);
            }
        },
        [cartId, removeCard]
    );

    const handleTogglePromptState = useCallback(() => {
        setPromptState(prevState => {
            switch (prevState) {
                case promptStates.ADD: {
                    return promptStates.ENTERING;
                }
                case promptStates.ENTERING:
                default: {
                    return promptStates.ADD;
                }
            }
        });

        setMostRecentAction(actions.TOGGLE);
    }, []);

    const errorApplyingCard = Boolean(applyCardResult.error);
    const errorCheckingBalance = Boolean(balanceResult.error);
    const shouldDisplayCardBalance =
        mostRecentAction === actions.CHECK_BALANCE &&
        Boolean(balanceResult.data);
    const shouldDisplayCardError =
        (errorApplyingCard && mostRecentAction === actions.APPLY) ||
        (errorCheckingBalance && mostRecentAction === actions.CHECK_BALANCE);

    return {
        canTogglePromptState,
        checkBalanceData:
            balanceResult.data && balanceResult.data.giftCardAccount,
        errorLoadingGiftCards: Boolean(cartResult.error),
        errorRemovingCard: Boolean(removeCardResult.error),
        giftCardsData:
            cartResult.data && cartResult.data.cart.applied_gift_cards,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        handleTogglePromptState,
        isLoadingGiftCards: cartResult.loading,
        isApplyingCard: applyCardResult.loading,
        isCheckingBalance: balanceResult.loading,
        isRemovingCard: removeCardResult.loading,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry: promptState === promptStates.ENTERING,
        shouldDisplayCardError
    };
};
