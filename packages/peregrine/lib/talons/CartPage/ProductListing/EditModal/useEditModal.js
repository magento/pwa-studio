import { useState } from 'react';

import { useAppContext } from '../../../../context/app';

/**
 * This talon contains logic for a product edit modal used on a cart page.
 * It returns prop data for rendering an interactive modal component.
 *
 * @function
 *
 * @return {EditModalTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';
 */
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

/** JSDocs type definitions */

/**
 * Object type returned by the {@link useEditModal} talon.
 * It provides props data for rendering an edit modal component.
 *
 * @typedef {Object} EditModalTalonProps
 *
 * @property {function} handleClose Callback function for handling the closing event of the modal.
 * @property {boolean} isOpen True if the modal is open. False otherwise.
 * @property {function} setVariantPrice Function for setting a product's variant price.
 * @property {Object} variantPrice The variant price for a product. See [Money object]{@link https://devdocs.magento.com/guides/v2.4/graphql/product/product-interface.html#Money}.
 */
