import { useCallback } from 'react';

export const useGiftCard = props => {
    const { code, removeGiftCard } = props;

    const removeGiftCardWithCode = useCallback(() => {
        removeGiftCard(code);
    }, [code, removeGiftCard]);

    return {
        removeGiftCardWithCode
    };
};
