import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

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
 * @returns {Function}  result.applyGiftCard - A callback to apply a gift card to the cart.
 * @returns {Boolean}   result.canTogglePromptState - Whether the user should be allowed to switch the prompt state.
 * @returns {Object}    result.checkBalanceData - The giftCardAccount object of the most recent successful check balance GraphQL query.
 * @returns {Function}  result.checkGiftCardBalance - A callback to check the balance of a gift card.
 * @returns {Boolean}   result.errorLoadingGiftCards - Whether there was an error loading the cart's gift cards.
 * @returns {Boolean}   result.errorApplyingCard - Whether there was an error applying the gift card.
 * @returns {Boolean}   result.errorCheckingBalance - Whether there was an error checking the balance of the gift card.
 * @returns {Boolean}   result.errorRemovingCard - Whether there was an error removing the gift card.
 * @returns {Array}     result.giftCardsData - The applied_gift_cards object of the cart query.
 * @returns {Boolean}   result.isLoadingGiftCards - Whether the cart's gift card data is loading.
 * @returns {Boolean}   result.isApplyingCard - Whether the apply gift card operation is in progress.
 * @returns {Boolean}   result.isCheckingBalance - Whether the check gift card balance operation is in progress.
 * @returns {Boolean}   result.isRemovingCard - Whether the remove gift card operation is in progress.
 * @returns {Function}  result.removeGiftCard - A callback to remove a gift card from the cart.
 * @returns {Boolean}   result.shouldDisplayCardBalance - Whether to display the gift card balance to the user.
 * @returns {Boolean}   result.shouldDisplayCardEntry - Whether to display the gift card entry form.
 * @returns {Boolean}   result.shouldDisplayCardError - Whether to display an error message under the card input field.
 * @returns {Function}  result.submitForm - Submits the form to apply or check balance of the supplied gift card code.
 * @returns {Function}  result.togglePromptState - A callback to toggle the prompt state.
 */
export const useGiftCards = props => {
    const {
        setIsCartUpdating,
        mutations: { applyCardMutation, removeCardMutation },
        queries: { cardBalanceQuery, cartQuery }
    } = props;

    // We need the cartId for all of our queries and mutations.
    const [{ cartId }] = useCartContext();

    /*
     * Apollo hooks.
     *
     * Immediately execute the cart query and set up the other graphql actions.
     */
    const [getCartDetails, cartResult] = useLazyQuery(cartQuery);
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
    const [formApi, setFormApi] = useState();
    const [mostRecentAction, setMostRecentAction] = useState(null);
    const [promptState, setPromptState] = useState(initialPromptState);

    /*
     *  useEffect hooks.
     */
    // Fire the getCartDetails query immediately and whenever cartId changes.
    useEffect(() => {
        if (!cartId) {
            return;
        }

        getCartDetails({
            fetchPolicy: 'cache-and-network',
            variables: { cartId }
        });
    }, [cartId, getCartDetails]);

    // Update the prompt state whenever the number of cards changes.
    useEffect(() => {
        const targetPromptState = getPromptStateForNumCards(numCards);
        setPromptState(targetPromptState);
    }, [numCards]);

    // Submit the form after the apply or check balance actions are taken.
    useEffect(() => {
        if (
            mostRecentAction === actions.APPLY ||
            mostRecentAction === actions.CHECK_BALANCE
        ) {
            if (formApi) {
                formApi.submitForm();
            }
        }
    }, [formApi, mostRecentAction]);

    /*
     * useCallback hooks.
     */
    const applyGiftCard = useCallback(() => {
        // Ensure the mostRecentAction is APPLY before submitting.
        if (mostRecentAction === actions.APPLY) {
            if (formApi) {
                formApi.submitForm();
            }
        } else {
            // A useEffect will take care of submitting once this async
            // operation finishes.
            setMostRecentAction(actions.APPLY);
        }
    }, [formApi, mostRecentAction]);

    const checkGiftCardBalance = useCallback(() => {
        // Ensure the mostRecentAction is CHECK_BALANCE before submitting.
        if (mostRecentAction === actions.CHECK_BALANCE) {
            if (formApi) {
                formApi.submitForm();
            }
        } else {
            // A useEffect will take care of submitting once this async
            // operation finishes.
            setMostRecentAction(actions.CHECK_BALANCE);
        }
    }, [formApi, mostRecentAction]);

    const removeGiftCard = useCallback(
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

    const submitForm = useCallback(
        values => {
            const giftCardCode = values['card'];

            if (mostRecentAction === actions.APPLY) {
                applyCard({
                    variables: {
                        cartId,
                        giftCardCode
                    }
                });
            }

            if (mostRecentAction === actions.CHECK_BALANCE) {
                checkCardBalance({
                    // Don't cache this one because the card can be used elsewhere
                    // before it is used again here.
                    fetchPolicy: 'no-cache',
                    variables: { giftCardCode }
                });
            }
        },
        [applyCard, cartId, checkCardBalance, mostRecentAction]
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

    const {
        called: applyCardCalled,
        loading: applyCardLoading
    } = applyCardResult;
    const {
        called: removeCardCalled,
        loading: removeCardLoading
    } = removeCardResult;

    useEffect(() => {
        if (applyCardCalled || removeCardCalled) {
            // If a gift card mutation is in flight, tell the cart.
            setIsCartUpdating(applyCardLoading || removeCardLoading);
        }
    }, [
        applyCardCalled,
        applyCardLoading,
        removeCardCalled,
        removeCardLoading,
        setIsCartUpdating
    ]);

    return {
        applyGiftCard,
        canTogglePromptState,
        checkBalanceData:
            balanceResult.data && balanceResult.data.giftCardAccount,
        checkGiftCardBalance,
        errorLoadingGiftCards: Boolean(cartResult.error),
        errorRemovingCard: Boolean(removeCardResult.error),
        giftCardsData:
            (cartResult.data && cartResult.data.cart.applied_gift_cards) || [],
        isLoadingGiftCards: cartResult.loading,
        isApplyingCard: applyCardLoading,
        isCheckingBalance: balanceResult.loading,
        isRemovingCard: removeCardLoading,
        removeGiftCard,
        setFormApi,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry: promptState === promptStates.ENTERING,
        shouldDisplayCardError,
        submitForm,
        togglePromptState
    };
};
