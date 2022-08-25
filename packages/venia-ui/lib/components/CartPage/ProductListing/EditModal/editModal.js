import React from 'react';
import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';

import ProductForm from './productForm';

/**
 * A child component of the ProductListing component.
 * This component renders an edit modal for a product.
 *
 * @param {Object} props
 * @param {Object} props.item Product to edit.
 * @param {function} props.setActiveEditItem Function for setting the actively editing item
 * See [productListingFragments.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListingFragments.js}
 * for a list of properties for this object.
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [editModal.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/EditModal/editModal.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import EditModal from "@magento/venia-ui/lib/components/CartPage/ProductListing/EditModal";
 */
const EditModal = props => {
    const { item, setActiveEditItem, setIsCartUpdating } = props;
    const talonProps = useEditModal();
    const { setVariantPrice, variantPrice } = talonProps;

    return (
        <ProductForm
            item={item}
            setIsCartUpdating={setIsCartUpdating}
            setVariantPrice={setVariantPrice}
            variantPrice={variantPrice}
            setActiveEditItem={setActiveEditItem}
        />
    );
};

export default EditModal;
