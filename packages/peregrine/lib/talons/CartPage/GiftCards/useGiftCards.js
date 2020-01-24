import { useCallback, useState, useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useGiftCards = props => {
    const { applyCardMutation, cardBalanceQuery, cartQuery, removeCardMutation } = props;

    const [shouldDisplayCardBalance, setShouldDisplayCardBalance] = useState(false);
    const [{ cartId }] = useCartContext();

    const cartResult = useQuery(cartQuery, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network'
    });

    const [checkCardBalance, balanceResult] = useLazyQuery(cardBalanceQuery);
    const [applyCard, applyCardResult] = useMutation(applyCardMutation);
    const [removeCard, removeCardResult] = useMutation(removeCardMutation);

    const handleApplyCard = useCallback(giftCardCode => {
        applyCard({
            variables: {
                cartId,
                giftCardCode
            }
        });

        setShouldDisplayCardBalance(false);
    }, [applyCard, cartId]);

    const handleCheckCardBalance = useCallback(async giftCardCode => {
        await checkCardBalance({
            fetchPolicy: 'no-cache',
            variables: { giftCardCode }
        });

        // TODO: but what if this errors?
        setShouldDisplayCardBalance(true);
    }, [checkCardBalance]);

    const handleRemoveCard = useCallback(giftCardCode => {
        removeCard({
            variables: {
                cartId,
                giftCardCode
            }
        });

        setShouldDisplayCardBalance(false);
    }, [cartId, removeCard]);

    useEffect(() => {
        const haveCardBalanceData = Boolean(balanceResult.data);
        setShouldDisplayCardBalance(haveCardBalanceData);
    }, [balanceResult.data]);

    return {
        applyCardResult,
        balanceResult,
        cartResult,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        removeCardResult,
        setShouldDisplayCardBalance,
        shouldDisplayCardBalance
    };
};
