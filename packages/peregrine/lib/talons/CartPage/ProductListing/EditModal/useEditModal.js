import { useState } from 'react';

import { useAppContext } from '../../../../context/app';

/**
 * This talon contains logic for a product edit modal used on a cart page.
 * It performs effects and returns prop data for rendering an interactive modal component.
 * 
 * @function
 * 
 * @return {EditModalProps} 
 * 
 * @example <caption>Importing into your project</caption>
 * import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';
 */
export const useEditModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'product.edit';

    const [variantPrice, setVariantPrice] = useState(null);

    /**
     * Object type returned by the {@link useEditModal} talon.
     * It provides props data for rendering an edit modal component.
     * 
     * @typedef {Object} EditModalProps
     * 
     * @property {Function} handleClose Callback function for handling the closing event of the modal.
     * @property {boolean} isOpen True if the modal is open. False otherwise.
     * @property {Function} setVariantPrice Function for setting a product's variant price.
     * @property {Function} variantPrice The variant price for a product.
     */
    return {
        handleClose: closeDrawer,
        isOpen,
        setVariantPrice,
        variantPrice
    };
};
