import { useCallback } from 'react';

export const useGiftCard = props => {
    const { code, handleRemoveCard } = props;

    const handleRemoveCardWithCode = useCallback(() => {
        handleRemoveCard(code);
    }, [code, handleRemoveCard]);

    return {
        handleRemoveCardWithCode
    };
};
