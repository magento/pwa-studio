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
                        order_date: order.order_date,
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
                    value: '',
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
    }, [fetchCustomerOrders, fetchProductImage, formatMessage]);

    return {
        customerOrdersItems,
        customerOrdersSelect,
        getCustomerOrders,
        setCustomerOrdersItems,
        setCustomerOrdersSelect
    };
};
