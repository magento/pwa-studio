import { useCallback } from 'react';
import { useFormState } from 'informed';

export const useApplyButton = props => {
    const { handleApplyCard } = props;

    const giftCardEntryFormState = useFormState();

    const handleApplyCardWithCode = useCallback(() => {
        const giftCardCode = giftCardEntryFormState.values['card'];

        handleApplyCard(giftCardCode);
    }, [giftCardEntryFormState, handleApplyCard]);

    return {
        handleApplyCardWithCode
    };
};
