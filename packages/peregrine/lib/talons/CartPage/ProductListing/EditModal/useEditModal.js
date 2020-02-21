import { useCallback } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useEditModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'edit';

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        handleClose,
        isOpen
    };
};
