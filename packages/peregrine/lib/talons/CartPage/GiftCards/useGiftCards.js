import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

const cardActions = {
    APPLY: 'apply',
    CHECK_BALANCE: 'check balance',
    REMOVE: 'remove',
    TOGGLE: 'toggle'
};
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

    // Immediately execute the cart query and set up the other graphql actions.
    const cartResult = useQuery(cartQuery, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network'
    });
    const [checkCardBalance, balanceResult] = useLazyQuery(cardBalanceQuery);
    const [applyCard, applyCardResult] = useMutation(applyCardMutation);
    const [removeCard, removeCardResult] = useMutation(removeCardMutation);

    // Whenever the cart data changes, update the number of cards we have
    // and any variables dependent on that.
    const numCards = useMemo(() => {
        return cartResult.data
            ? cartResult.data.cart.applied_gift_cards.length
            : Number.NEGATIVE_INFINITY;
    }, [cartResult.data]);

    const canTogglePromptState = numCards > 0;
    const initialPromptState =
        numCards === 0 ? promptStates.ENTERING : promptStates.ADD;
    
    // useState hooks.
    const [mostRecentAction, setMostRecentAction] = useState(null);
    const [promptState, setPromptState] = useState(initialPromptState);
    const [shouldDisplayCardBalance, setShouldDisplayCardBalance] = useState(
        false
    );

    // useEffect hooks.
    useEffect(() => {
        // If the number of cards drops to zero after initialization
        // (likely due to a removal), force the prompt state back to ENTERING.
        if (numCards === 0) {
            setPromptState(promptStates.ENTERING);
        }
    }, [numCards]);
    useEffect(() => {
        const haveCardBalanceData = Boolean(balanceResult.data);
        const mostRecentActionIsCheckBalance = mostRecentAction === cardActions.CHECK_BALANCE;

        setShouldDisplayCardBalance(mostRecentActionIsCheckBalance && haveCardBalanceData);
    }, [balanceResult.data, mostRecentAction]);

    // Callbacks.
    const handleApplyCard = useCallback(
        giftCardCode => {
            applyCard({
                variables: {
                    cartId,
                    giftCardCode
                }
            });

            setMostRecentAction(cardActions.APPLY);
        },
        [applyCard, cartId]
    );

    const handleCheckCardBalance = useCallback(
        giftCardCode => {
            checkCardBalance({
                fetchPolicy: 'no-cache',
                variables: { giftCardCode }
            });

            setMostRecentAction(cardActions.CHECK_BALANCE);
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

            setMostRecentAction(cardActions.REMOVE);
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

        setMostRecentAction(cardActions.TOGGLE);
    }, []);

    return {
        applyCardResult,
        balanceResult,
        canTogglePromptState,
        cartResult,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        removeCardResult,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry: promptState === promptStates.ENTERING,
        togglePromptState
    };
};
