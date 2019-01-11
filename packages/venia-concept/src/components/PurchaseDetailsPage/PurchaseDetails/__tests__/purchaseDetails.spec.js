import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DetailsBlock from '../../DetailsBlock';
import PurchaseDetails from '../purchaseDetails';
import OrderItem from '../../OrderItem';
import OrderItemsList from '../../OrderItemsList';
import Button from 'src/components/Button';

configure({ adapter: new Adapter() });

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
        id: 1,
        name: 'name',
        size: 'size',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 12,
        sku: 'sku'
    }
];

test('renders correctly', () => {
    const fetchOrderDetailsMock = jest.fn();
    const wrapper = shallow(
        <PurchaseDetails
            shipmentDetails={shipmentDetailsMock}
            orderDetails={commonOrderDetailsMock}
            paymentDetails={paymentDetailsMock}
            orderSummary={orderSummaryMock}
            item={itemMock}
            otherItems={otherItemsMock}
            fetchOrderDetails={fetchOrderDetailsMock}
        />
    ).dive();
    expect(wrapper.find(DetailsBlock)).toHaveLength(4);
    expect(wrapper.find(Button)).toHaveLength(1);
    expect(wrapper.find(OrderItem)).toHaveLength(1);
    expect(wrapper.find(OrderItemsList)).toHaveLength(1);
});
