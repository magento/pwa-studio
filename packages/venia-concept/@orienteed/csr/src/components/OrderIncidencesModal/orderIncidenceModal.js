import React from 'react';
import { useIntl } from 'react-intl';

import Dialog from './Dialog/dialog';
import Dropzone from '../CreateTicketModal/Dropzone/dropzone';
import notFoundImage from '../CreateTicketModal/Icons/notFound.svg';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useOrderIncidencesModal } from '../../talons/useOrderIncidencesModal';

import defaultClasses from './orderIncidenceModal.module.css';

const OrderIncidencesModal = props => {
    const {
        isOpen,
        setTicketModal,
        orderNumber,
        orderDate,
        orderStatus,
        orderTotal,
        imagesData,
        setSuccessToast,
        setErrorToast
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const talonProps = useOrderIncidencesModal({
        setTicketModal,
        setSuccessToast,
        setErrorToast
    });

    const {
        closeModal,
        createTicketStatus,
        dropzoneError,
        filesUploaded,
        onConfirm,
        setDropzoneError,
        setFilesUploaded,
        setOrderData,
        setTicketDescription,
        setTicketTitle,
        showPlaceholder
    } = talonProps;

    // Translations
    const attachFilesText = formatMessage({ id: 'csr.attachFiles', defaultMessage: 'Attach files (max. 6 files)' });
    const newTicketText = formatMessage({ id: 'csr.newTicket', defaultMessage: 'New ticket' });
    const orderDateText = formatMessage({ id: 'csr.orderDate', defaultMessage: 'Order date' });
    const orderIssueText = formatMessage({ id: 'csr.orderIssue', defaultMessage: 'Order issue' });
    const orderNumberText = formatMessage({ id: 'csr.orderNumber', defaultMessage: 'Order number' });
    const sendingTicketText = formatMessage({ id: 'csr.sendingTicket', defaultMessage: 'Sending ticket...' });
    const statusText = formatMessage({ id: 'csr.status', defaultMessage: 'Status' });
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

    const ticketOptions = [{ value: 'Order issue', label: orderIssueText }];

    const orderData = {
        image_url: Object.values(imagesData)[0]?.thumbnail?.url,
        number: orderNumber,
        order_date: orderDate,
        status: orderStatus,
        total: `${orderTotal.props.value} ${orderTotal.props.currencyCode === 'EUR' ? '€' : '$'}`
    };

    // Methods
    const showOrderDetails = () => {
        return (
            <div className={classes.orderItemContainer}>
                <img
                    src={Object.values(imagesData)[0]?.thumbnail?.url || notFoundImage}
                    className={classes.orderItemImage}
                    alt="Order product"
                />
                <div className={classes.orderItemDataContainer}>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{orderNumberText}</p>
                        <p className={classes.orderItemFieldValue}>{orderNumber}</p>
                    </div>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{orderDateText}</p>
                        <p className={classes.orderItemFieldValue}>{orderDate}</p>
                    </div>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{statusText}</p>
                        <p className={classes.orderItemFieldValue}>{orderStatus}</p>
                    </div>
                    <div className={classes.orderItemFieldContainer}>
                        <p className={classes.orderItemFieldTitle}>{totalPriceText}</p>
                        <p className={classes.orderItemFieldValue}>{orderTotal}</p>
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
                            initialValue={'Order issue'}
                            field={'ticketType'}
                            items={ticketOptions}
                            disabled={true}
                        />
                    </div>
                    <div className={classes.row}>{showOrderDetails()}</div>
                    <div className={classes.row}>
                        <p>{titleText}</p>
                        <TextInput
                            field="Ticket title"
                            validate={isRequired}
                            placeholder={titlePlaceholder}
                            maxLength={100}
                            onChange={e => {
                                setTicketTitle(e.target.value);
                                setOrderData(orderData);
                            }}
                        />
                    </div>
                    <div className={classes.row}>
                        <p>{descriptionText}</p>
                        <TextArea
                            id="description"
                            field="description"
                            validate={isRequired}
                            placeholder={showPlaceholder}
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

export default OrderIncidencesModal;
