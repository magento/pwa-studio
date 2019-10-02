import { useCallback } from 'react';

export const useEmptyMiniCart = props => {
    const { closeDrawer } = props;

    const handleClick = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        handleClick
    };
};
