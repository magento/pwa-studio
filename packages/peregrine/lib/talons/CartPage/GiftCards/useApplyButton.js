import { useCallback } from 'react';
import { useFormState } from 'informed';

export const useApplyButton = props => {
    const { applyGiftCard } = props;

    const giftCardEntryFormState = useFormState();

    const applyGiftCardWithCode = useCallback(() => {
        const giftCardCode = giftCardEntryFormState.values['card'];

        applyGiftCard(giftCardCode);
    }, [applyGiftCard, giftCardEntryFormState]);

    return {
        applyGiftCardWithCode
    };
};
