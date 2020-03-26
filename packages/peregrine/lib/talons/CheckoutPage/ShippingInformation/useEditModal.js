import { useAppContext } from '../../../context/app';

export const useEditModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'shipping.edit';

    return {
        handleClose: closeDrawer,
        isOpen
    };
};
