import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

// To keep track of the most recent action taken.
const actions = {
    APPLY: 'apply',
    CHECK_BALANCE: 'check',
    REMOVE: 'remove'
};

/**
 * The useGiftCards talon handles effects for GiftCards and returns props necessary for rendering
 * the GiftCards component.
 *
 * @param {Object}     props
 * @param {GraphQLAST} props.applyCardMutation - The mutation used to apply a gift card to the cart.
 * @param {GraphQLAST} props.cardBalanceQuery - The query used to get the balance of a gift card.
 * @param {GraphQLAST} props.appliedCardsQuery - The query used to get the gift cards currently applied to the cart.
 * @param {GraphQLAST} props.removeCardMutation - The mutation used to remove a gift card from the cart.
 *
 * @returns {Object}    result
 * @returns {Function}  result.applyGiftCard - A callback to apply a gift card to the cart.
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
 * @returns {Boolean}   result.shouldDisplayCardBalance - Whether to display the gift card balance to the user
 * @returns {Boolean}   result.shouldDisplayCardError - Whether to display an error message under the card input field.
 */
export const useGiftCards = props => {
    const {
        setIsCartUpdating,
        mutations: { applyCardMutation, removeCardMutation },
        queries: { appliedCardsQuery, cardBalanceQuery }
    } = props;

    // We need the cartId for all of our queries and mutations.
    const [{ cartId }] = useCartContext();

    /*
     * Apollo hooks.
     *
     * Immediately execute the cart query and set up the other graphql actions.
     */
    const [getAppliedCards, appliedCardsResult] = useLazyQuery(
        appliedCardsQuery
    );
    const [checkCardBalance, balanceResult] = useLazyQuery(cardBalanceQuery);
    const [applyCard, applyCardResult] = useMutation(applyCardMutation);
    const [removeCard, removeCardResult] = useMutation(removeCardMutation);

    /*
     *  useState hooks.
     */
    const [formApi, setFormApi] = useState();
    const [mostRecentAction, setMostRecentAction] = useState(null);

    /*
     *  useEffect hooks.
     */
    // Fire the getAppliedCards query immediately and whenever cartId changes.
    useEffect(() => {
        if (cartId) {
            getAppliedCards({
                fetchPolicy: 'cache-and-network',
                variables: { cartId }
            });
        }
    }, [cartId, getAppliedCards]);

    /*
     * useCallback hooks.
     */
    const applyGiftCard = useCallback(async () => {
        setMostRecentAction(actions.APPLY);

        const giftCardCode = formApi.getValue('card');

        await applyCard({
            variables: {
                cartId,
                giftCardCode
            }
        });

        // Clear the input form after successful apply.
        formApi.reset();
    }, [formApi, applyCard, cartId]);

    const checkGiftCardBalance = useCallback(() => {
        setMostRecentAction(actions.CHECK_BALANCE);

        const giftCardCode = formApi.getValue('card');

        checkCardBalance({
            // Don't cache this one because the card can be used elsewhere
            // before it is used again here.
            fetchPolicy: 'no-cache',
            variables: { giftCardCode }
        });
    }, [formApi, checkCardBalance]);

    const removeGiftCard = useCallback(
        async giftCardCode => {
            setMostRecentAction(actions.REMOVE);

            try {
                await removeCard({
                    variables: {
                        cartId,
                        giftCardCode
                    }
                });
            } catch (err) {
                // do nothing
            }
        },
        [cartId, removeCard]
    );

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

    const shouldDisplayCardBalance =
        mostRecentAction === actions.CHECK_BALANCE &&
        Boolean(balanceResult.data);

    // We should only display the last card error if the most recent action was apply or check and they had an error
    const shouldDisplayCardError =
        (mostRecentAction === actions.APPLY && applyCardResult.error) ||
        (mostRecentAction === actions.CHECK_BALANCE && balanceResult.error);

    return {
        applyGiftCard,
        checkBalanceData:
            balanceResult.data && balanceResult.data.giftCardAccount,
        checkGiftCardBalance,
        errorLoadingGiftCards: Boolean(appliedCardsResult.error),
        errorRemovingCard: Boolean(removeCardResult.error),
        giftCardsData:
            (appliedCardsResult.data &&
                appliedCardsResult.data.cart.applied_gift_cards) ||
            [],
        isLoadingGiftCards: appliedCardsResult.loading,
        isApplyingCard: applyCardLoading,
        isCheckingBalance: balanceResult.loading,
        isRemovingCard: removeCardLoading,
        removeGiftCard,
        setFormApi,
        shouldDisplayCardBalance,
        shouldDisplayCardError
    };
};
