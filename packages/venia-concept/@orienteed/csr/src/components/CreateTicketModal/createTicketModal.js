import React from 'react';
import { useIntl } from 'react-intl';

import Dialog from './Dialog/dialog';
import Dropzone from '@magento/venia-concept/@orienteed/customComponents/components/PrintPdfPopup/Dropzone';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './createTicketModal.module.css';

const CreateTicketModal = props => {
    const { isOpen, onConfirm, onCancel } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const newTicketText = formatMessage({ id: 'csr.newTicket', defaultMessage: 'New ticket' });
    const ticketTypeText = formatMessage({ id: 'csr.ticketType', defaultMessage: 'Ticket type' });
    const titleText = formatMessage({ id: 'csr.title', defaultMessage: 'Title' });
    const descriptionText = formatMessage({ id: 'csr.description', defaultMessage: 'Description' });
    const attachFilesText = formatMessage({ id: 'csr.attachFiles', defaultMessage: 'Attach files (max. 6 files)' });
    const dragFileText = formatMessage({ id: 'csr.dragFile', defaultMessage: 'Drag a file here' });
    const titlePlaceholder = formatMessage({ id: 'csr.titlePlaceholder', defaultMessage: 'Enter a title for your ticket' });
    const orderIssuePlaceholder = formatMessage({
        id: 'csr.orderIssuePlaceholder',
        defaultMessage:
            'Describe your problem and what products are related.\nAt B2BStore, our priority is the customer.'
    });
    const supportIssuePlaceholder = formatMessage({
        id: 'csr.supportIssuePlaceholder',
        defaultMessage:
            'Describe the problem you have found and we will fix it as soon as possible. If you consider it, you can attach screenshots of the problem.\nThanks for improving B2BStore!'
    });
    const enhacementPlaceholder = formatMessage({
        id: 'csr.enhacementPlaceholder',
        defaultMessage: 'Do you have any idea to improve B2BStore? Tell us, we are open to improve.'
    });

    // titulo - 100 caracteres
    // descripcion - 10k caracteres limit hided

    return (
        <Dialog
            cancelText={'Cancel'}
            cancelTranslationId={'global.cancelButton'}
            confirmText={'Send'}
            confirmTranslationId={'contactPage.submit'}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            title={newTicketText}
        >
            <div className={classes.root}>
                <div className={classes.row}>
                    <p>{ticketTypeText}</p>
                    <TextInput field="Ticket type" validate={isRequired} />
                </div>
                <div className={classes.row}>
                    <p>{titleText}</p>
                    <TextInput field="Ticket title" validate={isRequired} placeholder={titlePlaceholder} />
                </div>
                <div className={classes.row}>
                    <p>{descriptionText}</p>
                    <TextArea
                        id="description"
                        field="description"
                        validate={isRequired}
                        placeholder={supportIssuePlaceholder}
                    />
                </div>
                <div className={classes.row}>
                    <p>{attachFilesText}</p>
                    <Dropzone>{dragFileText}</Dropzone>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateTicketModal;
