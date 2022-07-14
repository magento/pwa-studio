import { useCallback, useState } from 'react';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useIntl } from 'react-intl';

import { GET_CUSTOMER_ORDERS, GET_IMAGE_BY_SKU } from '../graphql/createTicketModal.gql';

export const useCreateTicketModal = () => {
    const fetchCustomerOrders = useAwaitQuery(GET_CUSTOMER_ORDERS);
    const fetchProductImage = useAwaitQuery(GET_IMAGE_BY_SKU);
    const { formatMessage } = useIntl();

    // States
    const [customerOrdersItems, setCustomerOrdersItems] = useState([]);
    const [customerOrdersSelect, setCustomerOrdersSelect] = useState([]);

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

        // const newDay = day.toString().padStart(2, '0');
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

                    return {
                        number: order.number,
                        order_date: isoDateToLocaleDate(order.order_date),
                        status: order.status,
                        total: `${order.total.grand_total.value} ${
                            order.total.grand_total.currency === 'EUR' ? '€' : '$'
                        }`,
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

    return {
        customerOrdersItems,
        customerOrdersSelect,
        getCustomerOrders,
        setCustomerOrdersItems,
        setCustomerOrdersSelect
    };
};
