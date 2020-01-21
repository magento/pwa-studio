import { useCallback } from 'react';
import { useFormState } from 'informed';

export const useCheckBalanceButton = () => {
    const giftCardEntryFormState = useFormState();

    const handleCheckBalance = useCallback(() => {
        const cardCode = giftCardEntryFormState.values['card'];
        
        // TODO: gql mutation here.
        console.log('check balance of card', cardCode);
    }, [giftCardEntryFormState]);

    return {
        handleCheckBalance
    };
};
