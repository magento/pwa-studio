import { useState } from 'react';

import { useAppContext } from '../../../../context/app';

export const useEditModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'product.edit';

    const [variantPrice, setVariantPrice] = useState(null);

    return {
        handleClose: closeDrawer,
        isOpen,
        setVariantPrice,
        variantPrice
    };
};
