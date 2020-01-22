import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useGiftCard = props => {
    const { giftCardCode, removeGiftCardMutation } = props;

    const [{ cartId }] = useCartContext();
    const [removeGiftCard, { data, error, loading }] = useMutation(removeGiftCardMutation);

    const handleRemoveGiftCard = useCallback(() => {
        removeGiftCard({
            variables: {
                cartId,
                giftCardCode
            }
        });
    }, [cartId, giftCardCode, removeGiftCard]);

    return {
        handleRemoveGiftCard,
        isRemoving: loading
    };
};
