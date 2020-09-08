import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';

import OrderRow from '../orderRow';

jest.mock('@magento/peregrine', () => {
    const Price = props => <span>{`$${props.value}`}</span>;

    return {
        ...jest.requireActual('@magento/peregrine'),
        Price
    };
});
jest.mock('@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow');

jest.mock('../../../classify');
jest.mock('../collapsedImageGallery', () => 'CollapsedImageGallery');
jest.mock('../orderProgressBar', () => 'OrderProgressBar');

const mockOrder = {
    invoices: [],
    items: ['item1', 'item2'],
    number: '000001',
    order_date: '2020-08-26 18:22:35',
    shipments: [],
    status: 'Processing',
    total: {
        grand_total: {
            currency: 'USD',
            value: 123.45
        }
    }
};

test('it renders collapsed order row', () => {
    useOrderRow.mockReturnValue({
        isOpen: false,
        handleContentToggle: jest.fn().mockName('handleContentToggle')
    });

    const tree = createTestInstance(<OrderRow order={mockOrder} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it renders open order row', () => {
    useOrderRow.mockReturnValue({
        isOpen: true,
        handleContentToggle: jest.fn().mockName('handleContentToggle')
    });

    const orderWithShipment = {
        ...mockOrder,
        shipments: [1]
    };
    const tree = createTestInstance(<OrderRow order={orderWithShipment} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it renders shipped status', () => {
    useOrderRow.mockReturnValue({
        isOpen: false,
        handleContentToggle: jest.fn()
    });

    const orderWithInvoice = {
        ...mockOrder,
        invoices: [1]
    };
    const tree = createTestInstance(<OrderRow order={orderWithInvoice} />);
    const { root } = tree;
    const orderProgressProps = root.findByType('OrderProgressBar').props;

    expect(orderProgressProps.status).toBe('Ready to ship');
});

test('it renders delivered status', () => {
    useOrderRow.mockReturnValue({
        isOpen: false,
        handleContentToggle: jest.fn()
    });

    const completedOrder = {
        ...mockOrder,
        status: 'Complete'
    };
    const tree = createTestInstance(<OrderRow order={completedOrder} />);
    const { root } = tree;
    const orderProgressProps = root.findByType('OrderProgressBar').props;

    expect(orderProgressProps.status).toBe('Delivered');
});
