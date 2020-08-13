import { useCallback } from 'react';

/**
 * Provide values for a Gift Card UI component
 * 
 * @function
 * 
 * @param {Object} props
 * @param {String} props.code Gift card's code
 * @param {Function} props.removeGiftCard A function that removes a gift card when provided a code
 * 
 * @return {GiftCardProps}
 */
export const useGiftCard = props => {
    const { code, removeGiftCard } = props;

    const removeGiftCardWithCode = useCallback(() => {
        removeGiftCard(code);
    }, [code, removeGiftCard]);

    /**
     * Data used for rendering a single Gift Card
     * @typedef {Object} GiftCardProps
     * 
     * @property {Function} removeGiftCardWithCode Function for removing the gift card associated with this talon
     */
    return {
        removeGiftCardWithCode
    };
};
