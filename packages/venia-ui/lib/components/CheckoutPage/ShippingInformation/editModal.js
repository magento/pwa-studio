import React from 'react';
import { FormattedMessage } from 'react-intl';
import { object, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import { Portal } from '../../Portal';
import AddressForm from './AddressForm';
import defaultClasses from './editModal.module.css';

const EditModal = props => {
    const { classes: propClasses, shippingData, onSuccess } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    // Unmount the form to force a reset back to original values on close
    const bodyElement = isOpen ? (
        <AddressForm
            onSuccess={onSuccess}
            afterSubmit={handleClose}
            onCancel={handleClose}
            shippingData={shippingData}
        />
    ) : null;

    return (
        <Portal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        <FormattedMessage
                            id={'checkoutPage.editShippingInfo'}
                            defaultMessage={'Edit Shipping Information'}
                        />
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
        </Portal>
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
