import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from './Dialog/dialog';

import defaultClasses from './confirmationModal.module.css';

const ConfirmationModal = props => {
    const { isOpen, onCancel, onConfirm, courseModuleName } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // Translations
    const modalTitleText = formatMessage({ id: 'lms.confirmationModalTitle', defaultMessage: 'Confirmation' });
    const subTitleText = formatMessage(
        {
            id: 'lms.confirmationMarkAsDoneSubTitle',
            defaultMessage: 'You are about to mark the activity {courseModuleName} as done'
        },
        {
            courseModuleName
        }
    );

    const subBodyText = formatMessage({
        id: 'lms.confirmationMarkAsDoneSubBody',
        defaultMessage: 'Are you sure you want to mark this activity as done?'
    });

    return (
        <Dialog title={modalTitleText} isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
            <div className={classes.confirmationModalContainer}>
                <div className={classes.confirmationModalBodyContainer}>
                    <p className={classes.headingText}>{subTitleText}</p>
                    <p className={classes.bodyText}>{subBodyText}</p>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;
