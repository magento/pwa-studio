import { useCallback } from 'react';
import { useFormState } from 'informed';

export const useCheckBalanceButton = props => {
    const { handleCheckCardBalance } = props;

    const giftCardEntryFormState = useFormState();

    const handleCheckCardBalanceWithCode = useCallback(() => {
        const giftCardCode = giftCardEntryFormState.values['card'];

        handleCheckCardBalance(giftCardCode);
    }, [giftCardEntryFormState, handleCheckCardBalance]);

    return {
        handleCheckCardBalanceWithCode
    };
};
