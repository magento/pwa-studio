import { useCallback } from 'react';
import { useFormState } from 'informed';

export const useCheckBalanceButton = props => {
    const { checkGiftCardBalance } = props;

    const giftCardEntryFormState = useFormState();

    const checkGiftCardBalanceWithCode = useCallback(() => {
        const giftCardCode = giftCardEntryFormState.values['card'];

        checkGiftCardBalance(giftCardCode);
    }, [checkGiftCardBalance, giftCardEntryFormState]);

    return {
        checkGiftCardBalanceWithCode
    };
};
