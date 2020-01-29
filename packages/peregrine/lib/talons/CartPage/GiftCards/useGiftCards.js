import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

const promptStates = {
    ADD: 'add',
    ENTERING: 'entering'
};

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
    const initialPromptState =
        numCards === 0 ? promptStates.ENTERING : promptStates.ADD;

    /*
     *  useState hooks.
     */
    const [promptState, setPromptState] = useState(initialPromptState);

    /*
     *  useEffect hooks.
     */
    useEffect(() => {
        // If the number of cards drops to zero after initialization
        // (likely due to a removal), force the prompt state back to ENTERING.
        if (numCards === 0) {
            setPromptState(promptStates.ENTERING);
        }
        else {
            // If the number of cards changes to anything else, show the ADD state.
            setPromptState(promptStates.ADD);
        }
    }, [numCards]);

    /*
     * useCallback hooks.
     */
    const handleApplyCard = useCallback(
        giftCardCode => {
            applyCard({
                variables: {
                    cartId,
                    giftCardCode
                }
            });
        },
        [applyCard, cartId]
    );

    const handleCheckCardBalance = useCallback(
        giftCardCode => {
            checkCardBalance({
                fetchPolicy: 'no-cache',
                variables: { giftCardCode }
            });
        },
        [checkCardBalance]
    );

    const handleRemoveCard = useCallback(
        giftCardCode => {
            removeCard({
                variables: {
                    cartId,
                    giftCardCode
                }
            });
        },
        [cartId, removeCard]
    );

    const togglePromptState = useCallback(() => {
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
    }, []);

    return {
        canTogglePromptState,
        checkBalanceData:
            balanceResult.data && balanceResult.data.giftCardAccount,
        errorLoadingGiftCards: cartResult.error,
        errorApplyingCard: applyCardResult.error,
        errorCheckingBalance: balanceResult.error,
        errorRemovingCard: removeCardResult.error,
        giftCardsData:
            cartResult.data && cartResult.data.cart.applied_gift_cards,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        isLoadingGiftCards: cartResult.loading,
        isApplyingCard: applyCardResult.loading,
        isCheckingBalance: balanceResult.loading,
        isRemovingCard: removeCardResult.loading,
        shouldDisplayCardBalance: Boolean(balanceResult.data),
        shouldDisplayCardEntry: promptState === promptStates.ENTERING,
        togglePromptState
    };
};
