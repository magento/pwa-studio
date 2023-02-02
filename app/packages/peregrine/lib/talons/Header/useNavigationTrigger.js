import { useCallback } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useNavigationTrigger = () => {
    const [, { toggleDrawer }] = useAppContext();

    const handleOpenNavigation = useCallback(() => {
        toggleDrawer('nav');
    }, [toggleDrawer]);

    return {
        handleOpenNavigation
    };
};
