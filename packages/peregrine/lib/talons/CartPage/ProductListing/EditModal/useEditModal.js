import { useState } from 'react';

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
    const [variantPrice, setVariantPrice] = useState(null);

    return {
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
 * @property {function} setVariantPrice Function for setting a product's variant price.
 * @property {Object} variantPrice The variant price for a product. See [Money object]{@link https://devdocs.magento.com/guides/v2.4/graphql/product/product-interface.html#Money}.
 */
