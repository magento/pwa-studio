import React, { useState } from 'react';
import { X as CloseIcon } from 'react-feather';

import Icon from '../../Icon';
import { Modal } from '../../Modal';
import { mergeClasses } from '../../../classify';
import CreditCardPaymentMethod from './creditCardPaymentMethod';

import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses, onClose } = props;

    /**
     * TODO need to create a talon for this component
     * and add update payment nonce logic.
     */

    const [isOpen, setIsOpen] = useState(true);

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
                        onClick={() => {
                            setIsOpen(false);
                            onClose();
                        }}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <CreditCardPaymentMethod
                        isHidden={false}
                        shouldRequestPaymentNonce={false}
                        onPaymentSuccess={() => {}}
                        brainTreeDropinContainerId={
                            'edit-modal-braintree-dropin-container'
                        }
                    />
                </div>
            </aside>
        </Modal>
    );
};

export default EditModal;
