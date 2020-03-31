import React from 'react';
import { X as CloseIcon } from 'react-feather';

import useEditModal from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import Button from '../../Button';
import Icon from '../../Icon';
import { Modal } from '../../Modal';
import { mergeClasses } from '../../../classify';
import CreditCardPaymentMethod from './creditCardPaymentMethod';

import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses, onClose } = props;

    const {
        isOpen,
        handleUpdate,
        handleClose,
        handlePaymentSuccess,
        shouldRequestPaymentNonce
    } = useEditModal({ onClose });

    const classes = mergeClasses(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        Edit Payment Information
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <CreditCardPaymentMethod
                        isHidden={false}
                        shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                        onPaymentSuccess={handlePaymentSuccess}
                        brainTreeDropinContainerId={
                            'edit-modal-braintree-dropin-container'
                        }
                    />
                    <div className={classes.actions_container}>
                        <Button
                            className={classes.cancel_button}
                            onClick={handleClose}
                            priority="normal"
                        >
                            {'Cancel'}
                        </Button>
                        <Button
                            className={classes.update_button}
                            onClick={handleUpdate}
                            priority="high"
                        >
                            {'Update'}
                        </Button>
                    </div>
                </div>
            </aside>
        </Modal>
    );
};

export default EditModal;
