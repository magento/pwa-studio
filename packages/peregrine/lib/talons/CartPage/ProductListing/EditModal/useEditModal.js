import { useAppContext } from '../../../../context/app';

export const useEditModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'product.edit';

    return {
        handleClose: closeDrawer,
        isOpen
    };
};
