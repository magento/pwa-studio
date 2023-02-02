import React from 'react';
import { useIntl } from 'react-intl';

import Dialog from '../../Dialog';
import Dropzone from './Dropzone/dropzone';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { useCreateTicketModal } from '@magento/peregrine/lib/talons/Csr/useCreateTicketModal';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './createTicketModal.module.css';

import notFoundImage from './Icons/notFound.svg';

const CreateTicketModal = props => {
    const { orderBy, isOpen, setTicketModal, setTickets, setTicketCount, setErrorToast, setSuccessToast } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const talonProps = useCreateTicketModal({
        orderBy,
        setErrorToast,
        setSuccessToast,
        setTicketCount,
        setTicketModal,
        setTickets
    });

    const {
        closeModal,
        createTicketStatus,
        customerOrdersItems,
        customerOrdersSelect,
        dropzoneError,
        filesUploaded,
        onConfirm,
        orderError,
        orderSelected,
        setDropzoneError,
        setFilesUploaded,
        setOrderError,
        setOrderSelected,
        setTicketDescription,
        setTicketTitle,
        setTicketType,
        showPlaceholder,
        ticketType
    } = talonProps;

    // Translations
    const attachFilesText = formatMessage({ id: 'csr.attachFiles', defaultMessage: 'Attach files (max. 6 files)' });
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
    const titlePlaceholder = formatMessage({
        id: 'csr.titlePlaceholder',
        defaultMessage: 'Enter a title for your ticket'
    });

    // Variables
    const acceptedFilesTypes =
        '*.jpg, *.jpeg, *.png, *.gif, *.mp3, *.wav, *.ogg, *.aac, *.mp4, *.avi, *.mpeg, *.pdf, *.txt, *.csv, *.zip, *.rar, *.gzip, *.tar.gz';

    const ticketOptions = [
        { value: 'Support issue', label: supportIssueText },
        { value: 'Order issue', label: orderIssueText },
        { value: 'Enhancement', label: enhancementText }
    ];

    // Methods
    const showOrderDetails = () => {
        if (orderSelected === '') return;
        const orderItem = customerOrdersItems.find(item => item.number === orderSelected);

        return (
            <div className={classes.orderItemContainer}>
                <img
                    src={orderItem.image_url || notFoundImage}
                    className={classes.orderItemImage}
                    alt="Order product"
                />
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
