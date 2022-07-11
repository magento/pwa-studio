import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import Dialog from './Dialog/dialog';
import Dropzone from './Dropzone/dropzone';
import Select from '@magento/venia-ui/lib/components/Select';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useCreateTicketModal } from '../../talons/useCreateTicketModal';

import defaultClasses from './createTicketModal.module.css';

const CreateTicketModal = props => {
    const { isOpen, onConfirm, onCancel } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    const {
        customerOrdersItems,
        customerOrdersSelect,
        getCustomerOrders,
        setCustomerOrdersItems,
        setCustomerOrdersSelect
    } = useCreateTicketModal();

    const supportIssueText = formatMessage({ id: 'csr.supportIssue', defaultMessage: 'Support issue' });
    const orderIssueText = formatMessage({ id: 'csr.orderIssue', defaultMessage: 'Order issue' });
    const enhancementText = formatMessage({ id: 'csr.enhancement', defaultMessage: 'Enhancement' });
    const newTicketText = formatMessage({ id: 'csr.newTicket', defaultMessage: 'New ticket' });
    const ticketTypeText = formatMessage({ id: 'csr.ticketType', defaultMessage: 'Ticket type' });
    const titleText = formatMessage({ id: 'csr.title', defaultMessage: 'Title (max. 100 characters)' });
    const descriptionText = formatMessage({
        id: 'csr.description',
        defaultMessage: 'Description  (max. 10000 characters)'
    });
    const attachFilesText = formatMessage({ id: 'csr.attachFiles', defaultMessage: 'Attach files (max. 6 files)' });
    const titlePlaceholder = formatMessage({
        id: 'csr.titlePlaceholder',
        defaultMessage: 'Enter a title for your ticket'
    });
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

    // Methodssssssss
    const [ticketType, setTicketType] = useState('support');
    const [orderSelected, setOrderSelected] = useState('');
    const [filesUploaded, setFilesUploaded] = useState([]);
    const onChangeTicketType = e => {
        setTicketType(e.target.value);
    };

    useEffect(() => {
        getCustomerOrders().then(res => {
            if (res) {
                setCustomerOrdersItems(res[0]);
                setCustomerOrdersSelect(res[1]);
            }
        });
    }, [getCustomerOrders, setCustomerOrdersItems, setCustomerOrdersSelect]);

    const ticketOptions = [
        { value: 'support', label: supportIssueText },
        { value: 'order', label: orderIssueText },
        { value: 'enhancement', label: enhancementText }
    ];

    const showPlaceholder = () => {
        switch (ticketType) {
            case 'support':
                return supportIssuePlaceholder;
            case 'order':
                return orderIssuePlaceholder;
            case 'enhancement':
                return enhacementPlaceholder;
            default:
                return '';
        }
    };

    const orderNumberText = formatMessage({ id: 'csr.orderNumber', defaultMessage: 'Order number' });
    const orderDateText = formatMessage({ id: 'csr.orderDate', defaultMessage: 'Order date' });
    const statusText = formatMessage({ id: 'csr.status', defaultMessage: 'Status' });
    const totalPriceText = formatMessage({ id: 'csr.totalPrice', defaultMessage: 'Total price' });

    const showOrderDetails = () => {
        if (orderSelected === '') return;
        const orderItem = customerOrdersItems.find(item => item.number === orderSelected);

        return (
            <div className={classes.orderItemContainer}>
                <img src={orderItem.image_url} className={classes.orderItemImage} alt="Order product" />
                <div className={classes.orderItemDataContainer}>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{orderNumberText}</p>
                        <p className={classes.orderItemFieldValue}>{orderItem.number}</p>
                    </div>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{orderDateText}</p>
                        <p className={classes.orderItemFieldValue}>{orderItem.order_date}</p>
                    </div>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{statusText}</p>
                        <p className={classes.orderItemFieldValue}>{orderItem.status}</p>
                    </div>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{totalPriceText}</p>
                        <p className={classes.orderItemFieldValue}>{orderItem.total}</p>
                    </div>
                </div>
            </div>
        );
    };

    const onChangeOrder = e => {
        setOrderSelected(e.target.value);
    };

    const acceptedFilesTypes = "*.jpg, *.jpeg, *.png, *.gif, *.mp3, *.wav, *.ogg, *.aac, *.mp4, *.avi, *.mpeg, *.pdf, *.txt, *.csv, *.zip, *.rar, *.gzip, *.tar.gz";

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
                    <Select
                        initialValue={'support'}
                        field={'ticketType'}
                        items={ticketOptions}
                        onChange={onChangeTicketType}
                    />
                </div>
                {ticketType === 'order' && (
                    <Select
                        initialValue={''}
                        field={'orderNumber'}
                        items={customerOrdersSelect}
                        onChange={onChangeOrder}
                    />
                )}
                {orderSelected !== '' && showOrderDetails()}
                <div className={classes.row}>
                    <p>{titleText}</p>
                    <TextInput
                        field="Ticket title"
                        validate={isRequired}
                        placeholder={titlePlaceholder}
                        maxLength={100}
                    />
                </div>
                <div className={classes.row}>
                    <p>{descriptionText}</p>
                    <TextArea
                        id="description"
                        field="description"
                        validate={isRequired}
                        placeholder={showPlaceholder()}
                        maxLength={10000}
                    />
                </div>
                <div className={classes.row}>
                    <p>{attachFilesText}</p>
                    <Dropzone filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} />
                    <p className={classes.acceptedFiles}>{acceptedFilesTypes}</p>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateTicketModal;
