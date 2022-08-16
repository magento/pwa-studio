import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from './Dialog/dialog';

import defaultClasses from './attachmentModal.module.css';

const AttachmentModal = props => {
    const { isOpen, onConfirm, showAttachmentsBody } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const sharedFilesText = formatMessage({ id: 'csr.sharedFiles', defaultMessage: 'Shared files' });
    return (
        <Dialog title={sharedFilesText} isOpen={isOpen} onCancel={onConfirm}>
            <div className={classes.attachmentModalContainer}>{showAttachmentsBody}</div>
        </Dialog>
    );
};

export default AttachmentModal;
