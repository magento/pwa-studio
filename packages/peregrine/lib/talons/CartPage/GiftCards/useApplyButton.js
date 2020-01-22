import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useFormState } from 'informed';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useApplyButton = props => {
    const { applyGiftCard } = props;

    const [{ cartId }] = useCartContext();
    const [applyGiftCardFn, { data: applyData, error: applyError, loading: applyLoading }] = useMutation(applyGiftCard);
    const giftCardEntryFormState = useFormState();

    const handleApplyCard = useCallback(() => {
        const giftCardCode = giftCardEntryFormState.values['card'];

        applyGiftCardFn({
            variables: {
                cartId,
                giftCardCode
            }
        });
    }, [applyGiftCardFn, cartId, giftCardEntryFormState]);

    return {
        applyData,
        applyLoading,
        handleApplyCard
    };
};
