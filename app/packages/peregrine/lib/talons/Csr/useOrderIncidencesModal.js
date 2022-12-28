import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import createTicket from '../../RestApi/Csr/tickets/createTicket';

export const useOrderIncidencesModal = props => {
    const { setTicketModal, setSuccessToast, setErrorToast } = props;
    const { formatMessage } = useIntl();

    // Translations
    const attachedFilesText = formatMessage({ id: 'csr.attachedFile', defaultMessage: 'Attached file/s...' });
    const orderIssuePlaceholder = formatMessage({
        id: 'csr.orderIssuePlaceholder',
        defaultMessage:
            'Describe your problem and what products are related.\nAt B2BStore, our priority is the customer.'
    });
    const orderDetailsText = formatMessage({ id: 'csr.orderDetails', defaultMessage: 'Order details' });
    const orderNumberText = formatMessage({ id: 'csr.orderNumber', defaultMessage: 'Order number' });
    const orderDateText = formatMessage({ id: 'csr.orderDate', defaultMessage: 'Order date' });
    const statusText = formatMessage({ id: 'csr.status', defaultMessage: 'Status' });
    const totalPriceText = formatMessage({ id: 'csr.totalPrice', defaultMessage: 'Total price' });
    const orderDetailTexts = [orderDetailsText, orderNumberText, orderDateText, statusText, totalPriceText];

    // States
    const [createTicketStatus, setCreateTicketStatus] = useState('');
    const [dropzoneError, setDropzoneError] = useState('');
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [orderError, setOrderError] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketTitle, setTicketTitle] = useState('');
    const [orderData, setOrderData] = useState('');

    const ticketType = 'Order issue';

    // Methods
    const closeModal = () => {
        setOrderData('');
        setOrderError('');
        setDropzoneError('');
        setFilesUploaded([]);
        setTicketTitle('');
        setTicketDescription('');
        setCreateTicketStatus('');
        setTicketModal(false);
    };

    const showPlaceholder = orderIssuePlaceholder;

    const onConfirm = () => {
        setCreateTicketStatus('loading');
        createTicket(
            ticketType,
            ticketTitle,
            ticketDescription,
            filesUploaded,
            orderData,
            attachedFilesText,
            orderDetailTexts
        ).then(res => {
            if (res !== false) {
                setSuccessToast(true);
                setCreateTicketStatus('success');
            } else {
                setCreateTicketStatus('error');
                setErrorToast(true);
            }
        });
    };

    // Effects
    useEffect(() => {
        if (createTicketStatus === 'success' || createTicketStatus === 'error') {
            setCreateTicketStatus('');
            setDropzoneError('');
            setFilesUploaded([]);
            setOrderError('');
            setTicketDescription('');
            setTicketModal(false);
            setTicketTitle('');
        }
    }, [createTicketStatus, setTicketModal]);

    return {
        closeModal,
        createTicketStatus,
        dropzoneError,
        filesUploaded,
        onConfirm,
        orderError,
        setDropzoneError,
        setFilesUploaded,
        setOrderData,
        setOrderError,
        setTicketDescription,
        setTicketTitle,
        showPlaceholder
    };
};
