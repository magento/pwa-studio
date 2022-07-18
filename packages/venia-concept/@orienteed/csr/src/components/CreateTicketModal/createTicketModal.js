import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import Dialog from './Dialog/dialog';
import Dropzone from './Dropzone/dropzone';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useCreateTicketModal } from '../../talons/useCreateTicketModal';

import createTicket from '../../../services/tickets/createTicket';

import defaultClasses from './createTicketModal.module.css';

const CreateTicketModal = props => {
    const { isOpen, setTicketModal, setTickets, setErrorToast, setSuccessToast } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    const {
        customerOrdersItems,
        customerOrdersSelect,
        getCustomerOrders,
        setCustomerOrdersItems,
        setCustomerOrdersSelect
    } = useCreateTicketModal();

    const attachFilesText = formatMessage({ id: 'csr.attachFiles', defaultMessage: 'Attach files (max. 6 files)' });
    const attachedFilesText = formatMessage({ id: 'csr.attachedFile', defaultMessage: 'Attached file/s...' });
    const enhancementText = formatMessage({ id: 'csr.enhancement', defaultMessage: 'Enhancement' });
    const newTicketText = formatMessage({ id: 'csr.newTicket', defaultMessage: 'New ticket' });
    const orderDateText = formatMessage({ id: 'csr.orderDate', defaultMessage: 'Order date' });
    const orderIssueText = formatMessage({ id: 'csr.orderIssue', defaultMessage: 'Order issue' });
    const orderNumberText = formatMessage({ id: 'csr.orderNumber', defaultMessage: 'Order number' });
    const sendingTicketText = formatMessage({ id: 'csr.sendingTicket', defaultMessage: 'Sending ticket...' });
    const statusText = formatMessage({ id: 'csr.status', defaultMessage: 'Status' });
    const supportIssueText = formatMessage({ id: 'csr.supportIssue', defaultMessage: 'Support issue' });
    const ticketTypeText = formatMessage({ id: 'csr.ticketType', defaultMessage: 'Ticket type' });
    const titleText = formatMessage({ id: 'csr.title', defaultMessage: 'Title (max. 100 characters)' });
    const totalPriceText = formatMessage({ id: 'csr.totalPrice', defaultMessage: 'Total price' });
    const descriptionText = formatMessage({
        id: 'csr.description',
        defaultMessage: 'Description  (max. 10000 characters)'
    });
    const enhacementPlaceholder = formatMessage({
        id: 'csr.enhacementPlaceholder',
        defaultMessage: 'Do you have any idea to improve B2BStore? Tell us, we are open to improve.'
    });
    const orderIssuePlaceholder = formatMessage({
        id: 'csr.orderIssuePlaceholder',
        defaultMessage:
            'Describe your problem and what products are related.\nAt B2BStore, our priority is the customer.'
    });
    const orderNotFoundText = formatMessage({
        id: 'csr.orderNotFound',
        defaultMessage: 'No orders found, please change ticket type'
    });
    const orderNotSelectedText = formatMessage({
        id: 'csr.orderNotSelected',
        defaultMessage: 'Any order has been selected, please select one and try again'
    });
    const supportIssuePlaceholder = formatMessage({
        id: 'csr.supportIssuePlaceholder',
        defaultMessage:
            'Describe the problem you have found and we will fix it as soon as possible. If you consider it, you can attach screenshots of the problem.\nThanks for improving B2BStore!'
    });
    const titlePlaceholder = formatMessage({
        id: 'csr.titlePlaceholder',
        defaultMessage: 'Enter a title for your ticket'
    });

    // Methodssssssss
    const [createTicketStatus, setCreateTicketStatus] = useState('');
    const [dropzoneError, setDropzoneError] = useState('');
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [orderError, setOrderError] = useState('');
    const [orderSelected, setOrderSelected] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketType, setTicketType] = useState('Support issue');

    useEffect(() => {
        getCustomerOrders().then(res => {
            if (res) {
                setCustomerOrdersItems(res[0]);
                setCustomerOrdersSelect(res[1]);
            }
        });
    }, [getCustomerOrders, setCustomerOrdersItems, setCustomerOrdersSelect]);

    useEffect(() => {
        if (customerOrdersSelect && customerOrdersSelect.length !== 0) {
            setOrderSelected(customerOrdersSelect[0].value);
        }
    }, [customerOrdersSelect]);

    const ticketOptions = [
        { value: 'Support issue', label: supportIssueText },
        { value: 'Order issue', label: orderIssueText },
        { value: 'Enhancement', label: enhancementText }
    ];

    const showPlaceholder = () => {
        switch (ticketType) {
            case 'Support issue':
                return supportIssuePlaceholder;
            case 'Order issue':
                return orderIssuePlaceholder;
            case 'Enhancement':
                return enhacementPlaceholder;
            default:
                return '';
        }
    };

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

    const closeModal = () => {
        setTicketType('Support issue');
        customerOrdersItems.length !== 0 ? setOrderSelected('notSelected') : setOrderSelected('notFound');
        setOrderError('');
        setDropzoneError('');
        setFilesUploaded([]);
        setTicketTitle('');
        setTicketDescription('');
        setCreateTicketStatus('');
        setTicketModal(false);
    };

    useEffect(() => {
        if (createTicketStatus === 'success') {
            setTicketType('Support issue');
            customerOrdersItems.length !== 0 ? setOrderSelected('notSelected') : setOrderSelected('notFound');
            setOrderError('');
            setDropzoneError('');
            setFilesUploaded([]);
            setTicketTitle('');
            setTicketDescription('');
            setCreateTicketStatus('');
            setTicketModal(false);
        } else if (createTicketStatus === 'error') {
            setTicketType('Support issue');
            customerOrdersItems.length !== 0 ? setOrderSelected('notSelected') : setOrderSelected('notFound');
            setOrderError('');
            setDropzoneError('');
            setFilesUploaded([]);
            setTicketTitle('');
            setTicketDescription('');
            setCreateTicketStatus('');
            setTicketModal(false);
        }
    }, [createTicketStatus, setTicketModal, customerOrdersItems]);

    const acceptedFilesTypes =
        '*.jpg, *.jpeg, *.png, *.gif, *.mp3, *.wav, *.ogg, *.aac, *.mp4, *.avi, *.mpeg, *.pdf, *.txt, *.csv, *.zip, *.rar, *.gzip, *.tar.gz';

    const onConfirm = () => {
        if (ticketType === 'Order issue' && orderSelected === 'notFound') {
            setOrderError(orderNotFoundText);
        } else if (ticketType === 'Order issue' && orderSelected === 'notSelected') {
            setOrderError(orderNotSelectedText);
        } else {
            setCreateTicketStatus('loading');
            createTicket(
                ticketType,
                ticketTitle,
                ticketDescription,
                filesUploaded,
                customerOrdersItems.find(item => item.number === orderSelected),
                attachedFilesText
            ).then(res => {
                if (res !== false) {
                    setCreateTicketStatus('success');
                    setTickets(prevTickets => [...prevTickets, res]);
                    setSuccessToast(true);
                } else {
                    setCreateTicketStatus('error');
                    setErrorToast(true);
                }
            });
        }
    };

    return (
        <Dialog
            cancelText={'Cancel'}
            cancelTranslationId={'global.cancelButton'}
            confirmText={'Send'}
            confirmTranslationId={'contactPage.submit'}
            isOpen={isOpen}
            onCancel={closeModal}
            onConfirm={onConfirm}
            title={newTicketText}
        >
            {createTicketStatus === 'loading' && (
                <LoadingIndicator children={sendingTicketText} classes={{ root: classes.loadingIndicator }} />
            )}
            {createTicketStatus === '' && (
                <div className={classes.root}>
                    <div className={classes.row}>
                        <p>{ticketTypeText}</p>
                        <Select
                            initialValue={'Support issue'}
                            field={'ticketType'}
                            items={ticketOptions}
                            onChange={e => {
                                setTicketType(e.target.value);
                                setOrderError('');
                            }}
                        />
                    </div>
                    {ticketType === 'Order issue' && (
                        <div className={classes.row}>
                            <Select
                                field={'orderNumber'}
                                items={customerOrdersSelect}
                                onChange={e => {
                                    setOrderSelected(e.target.value);
                                    setOrderError('');
                                }}
                            />
                            {(orderSelected === 'notFound' || orderSelected === 'notSelected') && orderError !== '' && (
                                <p className={classes.errorMessage}>{orderError}</p>
                            )}
                            {orderSelected !== 'notFound' && orderSelected !== 'notSelected' && showOrderDetails()}
                        </div>
                    )}
                    <div className={classes.row}>
                        <p>{titleText}</p>
                        <TextInput
                            field="Ticket title"
                            validate={isRequired}
                            placeholder={titlePlaceholder}
                            maxLength={100}
                            onChange={e => setTicketTitle(e.target.value)}
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
                            onChange={e => setTicketDescription(e.target.value)}
                        />
                    </div>
                    <div className={classes.row}>
                        <p>{attachFilesText}</p>
                        <p className={classes.acceptedFiles}>{acceptedFilesTypes}</p>
                        <Dropzone
                            filesUploaded={filesUploaded}
                            setFilesUploaded={setFilesUploaded}
                            setDropzoneError={setDropzoneError}
                        />
                        {dropzoneError !== '' && <p className={classes.errorMessage}>{dropzoneError}</p>}
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default CreateTicketModal;
