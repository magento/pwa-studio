import { useCallback } from 'react';

export const useShoppingBag = props => {
    const { setIsOpen } = props;

    const onDismiss = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return {
        onDismiss
    };
};
