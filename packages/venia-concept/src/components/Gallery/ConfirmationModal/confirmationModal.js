import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage } from 'react-intl';
import Dialog from './Dialog/dialog';

import defaultClasses from './confirmationModal.module.css';

const ConfirmationModal = props => {
    const { isOpen, onCancel, onConfirm, product, quantity, setQuantity } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // Translations
    const modalTitleText = formatMessage({ id: 'csr.confirmationModalTitle', defaultMessage: 'Confirmation' });

    const confirmationBodyText =
        formatMessage({
            id: 'galleryItem.youAreAboutToReq',
            defaultMessage: 'You are about to request a quote for '
        }) +
        quantity +
        formatMessage({
            id: 'galleryItem.unitsOfProducts',
            defaultMessage: ' units of the product '
        }) +
        product?.product.name;

    return (
        <Dialog title={modalTitleText} isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
            <div className={classes.confirmationModalContainer}>
                <div className={classes.confirmationModalBodyContainer}>
                    <p className={classes.headingText}>{confirmationBodyText}</p>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;
