import { useCallback } from 'react';

/**
 * Provide logic for a single gift card component.
 *
 * @function
 *
 * @param {Object} props
 * @param {String} props.code Gift card's code
 * @param {function} props.removeGiftCard A function that removes a gift card when provided a code
 *
 * @return {GiftCardTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';
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

/** JSDoc type definitions */

/**
 * Props data to use when rendering a single gift card component.
 * @typedef {Object} GiftCardTalonProps
 *
 * @property {function} removeGiftCardWithCode Function for removing a gift card associated with the code passed into this talon.
 */
