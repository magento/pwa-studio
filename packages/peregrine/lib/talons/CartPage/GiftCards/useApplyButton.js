import { useCallback } from 'react';
import { useFormState } from 'informed';

export const useApplyButton = () => {
    const giftCardEntryFormState = useFormState();

    const handleApplyCard = useCallback(() => {
        const cardCode = giftCardEntryFormState.values['card'];

        // TODO: gql mutation here.
        console.log('apply card', cardCode);
    }, [giftCardEntryFormState]);

    return {
        handleApplyCard
    };
};
