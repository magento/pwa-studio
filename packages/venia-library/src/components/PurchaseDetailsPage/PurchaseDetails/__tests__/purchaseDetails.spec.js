import React from 'react';
import TestRenderer from 'react-test-renderer';

import LoadingIndicator from 'src/components/LoadingIndicator';
import PurchaseDetails from '../purchaseDetails';

jest.mock('src/components/LoadingIndicator');

const fetchOrderDetailsMock = jest.fn();

const commonOrderDetailsMock = [
    { property: 'Order No', value: 'orderNo' },
    { property: 'Order Date', value: 'orderDate' },
    { property: 'Total', value: 'total' },
    { property: 'Products', value: 'products' }
];

const shipmentDetailsMock = [
    { property: 'Method', value: 'method' },
    { property: 'Delivered', value: 'delivered' }
];

const paymentDetailsMock = [
    { property: 'Method', value: 'method' },
    {
        property: 'Billing Address',
        value: 'billingAddress'
    },
    {
        property: 'Shipping Address',
        value: 'shippingAddress'
    }
];

const orderSummaryMock = [
    { property: 'Items', value: 'items' },
    {
        property: 'Shipping and Handling',
        value: 'shippingAndHandling'
    },
    { property: 'Estimated Tax', value: 'estimatedTax' }
];

const itemMock = {
    id: 1,
    name: 'name',
    size: 'size',
    color: 'color',
    qty: 1,
    titleImageSrc: 'picture',
    price: 12,
    sku: 'sku'
};

const otherItemsMock = [
    {
        id: 1,
        name: 'name',
        size: 'size',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 12,
        sku: 'sku'
    },
    {
        id: 2,
        name: 'name',
        size: 'size',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 12,
        sku: 'sku'
    },
    {
        id: 3,
        name: 'name',
        size: 'size',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 12,
        sku: 'sku'
    }
];

test('renders the expected tree', () => {
    const tree = TestRenderer.create(
        <PurchaseDetails
            fetchOrderDetails={fetchOrderDetailsMock}
            item={itemMock}
            orderDetails={commonOrderDetailsMock}
            orderSummary={orderSummaryMock}
            otherItems={otherItemsMock}
            paymentDetails={paymentDetailsMock}
            shipmentDetails={shipmentDetailsMock}
        />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('calls fetchOrderDetails on mount', () => {
    TestRenderer.create(
        <PurchaseDetails
            fetchOrderDetails={fetchOrderDetailsMock}
            item={itemMock}
            orderDetails={commonOrderDetailsMock}
            orderSummary={orderSummaryMock}
            otherItems={otherItemsMock}
            paymentDetails={paymentDetailsMock}
            shipmentDetails={shipmentDetailsMock}
        />
    );

    expect(fetchOrderDetailsMock).toHaveBeenCalledTimes(1);
});

test('renders a loading indicator while loading', () => {
    const { root } = TestRenderer.create(
        <PurchaseDetails
            fetchOrderDetails={fetchOrderDetailsMock}
            isFetching={true}
            item={itemMock}
            orderDetails={commonOrderDetailsMock}
            orderSummary={orderSummaryMock}
            otherItems={otherItemsMock}
            paymentDetails={paymentDetailsMock}
            shipmentDetails={shipmentDetailsMock}
        />
    );

    const spinner = root.findByType(LoadingIndicator);

    expect(spinner).toBeTruthy();
});
