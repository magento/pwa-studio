import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import { Modal } from '../../Modal';
import EditForm from './EditForm';
import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses, shippingData } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        Edit Shipping Information
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <EditForm
                        afterSubmit={handleClose}
                        shippingData={shippingData}
                    />
                </div>
            </aside>
        </Modal>
    );
};

export default EditModal;
