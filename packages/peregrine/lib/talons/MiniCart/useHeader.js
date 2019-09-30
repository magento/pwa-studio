import { useCallback } from 'react';

export const useHeader = props => {
    const { closeDrawer } = props;

    const handleClick = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        handleClick
    };
};
