import React from 'react';
import { object, shape, string } from 'prop-types';
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

    // Unmount the form to force a reset back to original values on close
    const bodyElement = isOpen ? (
        <EditForm
            afterSubmit={handleClose}
            onCancel={handleClose}
            shippingData={shippingData}
        />
    ) : null;

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        {'Edit Shipping Information'}
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>{bodyElement}</div>
            </aside>
        </Modal>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        body: string,
        header: string,
        headerText: string
    }),
    shippingData: object
};
