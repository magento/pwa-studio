import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from './Dialog/dialog';

import defaultClasses from './confirmationModal.module.css';

const ConfirmationModal = props => {
    const { isOpen, onCancel, onConfirm, nextState, ticketNumber } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // Translations
    const modalTitleText = formatMessage({ id: 'csr.confirmationModalTitle', defaultMessage: 'Confirmation' });
    const confirmationTitleText = formatMessage(
        {
            id: 'csr.confirmationTitle',
            defaultMessage: 'You are about to {nextState} the ticket {ticketNumber}'
        },
        {
            nextState,
            ticketNumber
        }
    );
    const confirmationBodyText = formatMessage(
        {
            id: 'csr.confirmationBody',
            defaultMessage: 'Are you sure you want to {nextState} the ticket?'
        },
        {
            nextState
        }
    );

    return (
        <Dialog title={modalTitleText} isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
            <div className={classes.confirmationModalContainer}>
                <div className={classes.confirmationModalBodyContainer}>
                    <p className={classes.headingText}>{confirmationTitleText}</p>
                    <p className={classes.bodyText}>{confirmationBodyText}</p>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;
