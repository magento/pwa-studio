import { useCallback } from 'react';

/**
 * Provide values for a Gift Card UI component
 * 
 * @param {Object} props 
 */
export const useGiftCard = props => {
    const { code, removeGiftCard } = props;

    const removeGiftCardWithCode = useCallback(() => {
        removeGiftCard(code);
    }, [code, removeGiftCard]);

    return {
        removeGiftCardWithCode
    };
};
