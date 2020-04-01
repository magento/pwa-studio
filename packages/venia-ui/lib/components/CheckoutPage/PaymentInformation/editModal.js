import React from 'react';
import { func, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';

import useEditModal from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import Button from '../../Button';
import Icon from '../../Icon';
import { Modal } from '../../Modal';
import { mergeClasses } from '../../../classify';
import CreditCardPaymentMethod from './creditCardPaymentMethod';

import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses, onClose, selectedPaymentMethod } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useEditModal({ onClose });

    const {
        isOpen,
        handleUpdate,
        handleClose,
        handlePaymentSuccess,
        shouldRequestPaymentNonce
    } = talonProps;

    const rootClass = isOpen ? classes.root_open : classes.root;

    const paymentMethod =
        selectedPaymentMethod === 'creditCard' ? (
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
        ) : (
            <div>{`${selectedPaymentMethod} is not supported for editing.`}</div>
        );

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.header_text}>
                        Edit Payment Information
                    </span>
                    <button
                        className={classes.close_button}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                {paymentMethod}
            </aside>
        </Modal>
    );
};

EditModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        body: string,
        header: string,
        header_text: string,
        actions_container: string,
        cancel_button: string,
        update_button: string,
        close_button: string
    }),
    selectedPaymentMethod: string.isRequired,
    onClose: func.isRequired
};

export default EditModal;
