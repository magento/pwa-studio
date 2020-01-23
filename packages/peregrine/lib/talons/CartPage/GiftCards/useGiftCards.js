import { useCallback } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useGiftCards = props => {
    const { applyCardMutation, cardBalanceQuery, cartQuery, removeCardMutation } = props;

    const [{ cartId }] = useCartContext();

    // TODO: rename these
    const { data, error, loading } = useQuery(cartQuery, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network'
    });

    const [checkCardBalance] = useLazyQuery(cardBalanceQuery);
    const [applyCard] = useMutation(applyCardMutation);
    const [removeCard] = useMutation(removeCardMutation);

    const handleApplyCard = useCallback(giftCardCode => {
        applyCard({
            variables: {
                cartId,
                giftCardCode
            }
        });
    }, [applyCard, cartId]);

    const handleCheckCardBalance = useCallback(giftCardCode => {
        checkCardBalance({
            fetchPolicy: 'no-cache',
            variables: { giftCardCode }
        });
    }, [checkCardBalance]);

    const handleRemoveCard = useCallback(giftCardCode => {
        removeCard({
            variables: {
                cartId,
                giftCardCode
            }
        });
    }, [cartId, removeCard]);

    return {
        data,
        error,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        loading
    };
};
