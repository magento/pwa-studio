import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';

import { mergeClasses } from '../../../../classify';
import Icon from '../../../Icon';
import { Portal } from '../../../Portal';
import defaultClasses from './editModal.css';
import ProductDetail from './productDetail';
import ProductForm from './productForm';

const EditModal = props => {
    const { item, setIsCartUpdating } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen, setVariantPrice, variantPrice } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    const bodyComponent = item ? (
        <div className={classes.body} key={item.id}>
            <ProductDetail item={item} variantPrice={variantPrice} />
            <ProductForm
                item={item}
                setIsCartUpdating={setIsCartUpdating}
                setVariantPrice={setVariantPrice}
            />
        </div>
    ) : null;

    return (
        <Portal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>Edit Item</span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                {bodyComponent}
            </aside>
        </Portal>
    );
};

export default EditModal;
