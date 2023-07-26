import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '../../ConfirmationDialog';

import defaultClasses from './confirmationModal.module.css';

const ConfirmationModal = props => {
    const { isOpen, onCancel, onConfirm, products, isDisabled } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // Translations
    const modalTitleText = formatMessage({ id: 'csr.confirmationModalTitle', defaultMessage: 'Confirmation' });

    const confirmationTitleText = formatMessage({
        id: 'galleryItem.youAreAboutToReq',
        defaultMessage: 'You are about to request a quote for: '
    });

    const confirmationBodyText = formatMessage({
        id: 'galleryItem.confirmationBody',
        defaultMessage: 'Are you sure you want to request a quote for this products?'
    });

    return (
        <Dialog
            title={modalTitleText}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableConfirmButton={isDisabled}
        >
            <div className={classes.confirmationModalContainer}>
                <div className={classes.confirmationModalBodyContainer}>
                    <p className={classes.headingText}>{confirmationTitleText}</p>
                    <ul className={classes.productsList}>
                        {products?.map(ele => (
                            <li key={ele.name}>
                                <span className={classes.productWrapper}>
                                    <span>
                                        {ele.quantity}
                                        <FormattedMessage id="galleryItem.unitsOfProducts" defaultMessage=" units" />
                                    </span>
                                    <span>{ele.name}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className={classes.bodyText}>{confirmationBodyText}</p>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;
