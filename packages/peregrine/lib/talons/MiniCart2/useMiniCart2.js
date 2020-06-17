import { useCallback } from 'react';

export const useMiniCart2 = props => {
    const { setIsOpen } = props;

    const onDismiss = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return {
        onDismiss
    };
};
