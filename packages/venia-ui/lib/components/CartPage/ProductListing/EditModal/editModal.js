import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';

import { mergeClasses } from '../../../../classify';
import Icon from '../../../Icon';
import { Modal } from '../../../Modal';
import defaultClasses from './editModal.css';
import ProductDetail from './productDetail';
import ProductForm from './productForm';

const EditModal = props => {
    const { item } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    if (!item) {
        return null;
    }

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <button onClick={handleClose}>
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <ProductDetail item={props.item} />
                    <ProductForm />
                </div>
            </aside>
        </Modal>
    );
};

export default EditModal;
