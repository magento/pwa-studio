import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from './Dialog/dialog';

import defaultClasses from './confirmationModal.module.css';

const ConfirmationModal = props => {
    const { isOpen, onCancel, onConfirm, isEnrolled, courseName } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // Translations
    const modalTitleText = formatMessage({ id: 'lms.confirmationModalTitle', defaultMessage: 'Confirmation' });
    const confirmationSubTitleText = formatMessage(
        {
            id: 'lms.confirmationSubTitle',
            defaultMessage: 'You are about to subscribe to {courseName}'
        },
        {
            courseName
        }
    );

    const confirmationUnsubTitleText = formatMessage(
        {
            id: 'lms.confirmationUnsubTitle',
            defaultMessage: 'You are about to unsubscribe from {courseName}'
        },
        {
            courseName
        }
    );

    const confirmationSubBodyText = formatMessage({
        id: 'lms.confirmationSubBody',
        defaultMessage: 'Are you sure you want to subscribe to the course?'
    });

    const confirmationUnsubBodyText = formatMessage({
        id: 'lms.confirmationUnsubBody',
        defaultMessage: 'Are you sure you want to unsubscribe from the course?'
    });

    return (
        <Dialog title={modalTitleText} isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
            <div className={classes.confirmationModalContainer}>
                <div className={classes.confirmationModalBodyContainer}>
                    <p className={classes.headingText}>
                        {isEnrolled ? confirmationUnsubTitleText : confirmationSubTitleText}
                    </p>
                    <p className={classes.bodyText}>
                        {isEnrolled ? confirmationUnsubBodyText : confirmationSubBodyText}
                    </p>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;
