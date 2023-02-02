import { useCallback, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { getOrderPrice } from '../../util/orderPrice';

import createTicket from '../../RestApi/Csr/tickets/createTicket';

import { GET_CUSTOMER_ORDERS, GET_IMAGE_BY_SKU } from './createTicketModal.gql';

export const useCreateTicketModal = props => {
    const { orderBy, setTicketModal, setTickets, setTicketCount, setErrorToast, setSuccessToast } = props;
    const fetchCustomerOrders = useAwaitQuery(GET_CUSTOMER_ORDERS);
    const fetchProductImage = useAwaitQuery(GET_IMAGE_BY_SKU);
    const { formatMessage, locale } = useIntl();

    // Translations
    const attachedFilesText = formatMessage({ id: 'csr.attachedFile', defaultMessage: 'Attached file/s...' });
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
        defaultMessage: 'No order has been selected, please select one and try again'
    });
    const supportIssuePlaceholder = formatMessage({
        id: 'csr.supportIssuePlaceholder',
        defaultMessage:
            'Describe the problem you have found and we will fix it as soon as possible. If you consider it, you can attach screenshots of the problem.\nThanks for improving B2BStore!'
    });
    const orderDetailsText = formatMessage({ id: 'csr.orderDetails', defaultMessage: 'Order details' });
    const orderNumberText = formatMessage({ id: 'csr.orderNumber', defaultMessage: 'Order number' });
    const orderDateText = formatMessage({ id: 'csr.orderDate', defaultMessage: 'Order date' });
    const statusText = formatMessage({ id: 'csr.status', defaultMessage: 'Status' });
    const totalPriceText = formatMessage({ id: 'csr.totalPrice', defaultMessage: 'Total price' });
    const orderDetailTexts = [orderDetailsText, orderNumberText, orderDateText, statusText, totalPriceText];

    // States
    const [createTicketStatus, setCreateTicketStatus] = useState('');
    const [customerOrdersItems, setCustomerOrdersItems] = useState([]);
    const [customerOrdersSelect, setCustomerOrdersSelect] = useState([]);
    const [dropzoneError, setDropzoneError] = useState('');
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [orderError, setOrderError] = useState('');
    const [orderSelected, setOrderSelected] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketType, setTicketType] = useState('Support issue');

    // Methods
    const isoDateToLocaleDate = date => {
        const months = [
            formatMessage({ id: 'csr.january', defaultMessage: 'Jan' }),
            formatMessage({ id: 'csr.february', defaultMessage: 'Feb' }),
            formatMessage({ id: 'csr.march', defaultMessage: 'Mar' }),
            formatMessage({ id: 'csr.april', defaultMessage: 'Apr' }),
            formatMessage({ id: 'csr.may', defaultMessage: 'May' }),
            formatMessage({ id: 'csr.juny', defaultMessage: 'Jun' }),
            formatMessage({ id: 'csr.july', defaultMessage: 'Jul' }),
            formatMessage({ id: 'csr.august', defaultMessage: 'Aug' }),
            formatMessage({ id: 'csr.september', defaultMessage: 'Sep' }),
            formatMessage({ id: 'csr.october', defaultMessage: 'Oct' }),
            formatMessage({ id: 'csr.november', defaultMessage: 'Nov' }),
            formatMessage({ id: 'csr.december', defaultMessage: 'Dec' })
        ];
        const [year, month, day] = date.split(' ')[0].split('-');
        const newMonth = months[month - 1];

        return `${day} ${newMonth} ${year}`;
    };

    const getCustomerOrders = useCallback(async () => {
        try {
            const { data } = await fetchCustomerOrders();
            const orders = data?.customer?.orders?.items;

            const customerOrdersItems = await Promise.all(
                orders.map(async order => {
                    const { data } = await fetchProductImage({
                        variables: {
                            sku: order.items[0].product_sku
                        }
                    });

                    const orderItemPrice = getOrderPrice(
                        locale,
                        order.total.grand_total.currency,
                        order.total.grand_total.value
                    );

                    return {
                        number: order.number,
                        order_date: isoDateToLocaleDate(order.order_date),
                        status: order.status,
                        total: orderItemPrice,
                        currency: order.total.grand_total.currency,
                        image_url: data?.products?.items[0]?.image?.url
                    };
                })
            );

            let customerOrdersSelect = [
                {
                    value: customerOrdersItems.length !== 0 ? 'notSelected' : 'notFound',
                    label:
                        customerOrdersItems.length !== 0
                            ? formatMessage({ id: 'csr.selectOrder', defaultMessage: 'Select order' })
                            : formatMessage({ id: 'csr.noOrders', defaultMessage: 'No orders found' })
                }
            ];

            customerOrdersSelect = customerOrdersSelect.concat(
                customerOrdersItems.map(order => {
                    return {
                        value: order.number,
                        label: formatMessage(
                            {
                                id: 'csr.customerOrderSelect',
                                defaultMessage:
                                    'Order number {orderNumber} ({orderData}) - {orderStatus} - {orderTotal}'
                            },
                            {
                                orderNumber: order.number,
                                orderData: order.order_date,
                                orderStatus: order.status,
                                orderTotal: order.total
                            }
                        )
                    };
                })
            );

            return [customerOrdersItems, customerOrdersSelect];
        } catch (error) {
            console.error(error);
        }
    }, [fetchCustomerOrders, fetchProductImage, formatMessage]); //eslint-disable-line

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
                attachedFilesText,
                orderDetailTexts
            ).then(res => {
                if (res !== false) {
                    setCreateTicketStatus('success');
                    setSuccessToast(true);
                    setTickets(prevTickets => (orderBy === 'desc' ? [res, ...prevTickets] : [...prevTickets, res]));
                    setTicketCount(prevTicketCount => prevTicketCount + 1);
                } else {
                    setCreateTicketStatus('error');
                    setErrorToast(true);
                }
            });
        }
    };

    // Effects
    useEffect(() => {
        if (createTicketStatus === 'success' || createTicketStatus === 'error') {
            customerOrdersItems.length !== 0 ? setOrderSelected('notSelected') : setOrderSelected('notFound');
            setCreateTicketStatus('');
            setDropzoneError('');
            setFilesUploaded([]);
            setOrderError('');
            setTicketDescription('');
            setTicketModal(false);
            setTicketTitle('');
            setTicketType('Support issue');
        }
    }, [createTicketStatus, customerOrdersItems, setTicketModal]);

    useEffect(() => {
        if (customerOrdersSelect && customerOrdersSelect.length !== 0) {
            setOrderSelected(customerOrdersSelect[0].value);
        }
    }, [customerOrdersSelect, setOrderSelected]);

    useEffect(() => {
        getCustomerOrders().then(res => {
            if (res) {
                setCustomerOrdersItems(res[0]);
                setCustomerOrdersSelect(res[1]);
            }
        });
    }, [getCustomerOrders, setCustomerOrdersItems, setCustomerOrdersSelect]);

    return {
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
    };
};
