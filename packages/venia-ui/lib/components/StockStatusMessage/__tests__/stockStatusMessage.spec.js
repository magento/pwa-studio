import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useStockStatusMessage } from '@magento/peregrine/lib/talons/StockStatusMessage/useStockStatusMessage';

import StockStatusMessage from '../stockStatusMessage';

jest.mock('../../../classify');
jest.mock(
    '@magento/peregrine/lib/talons/StockStatusMessage/useStockStatusMessage'
);

test('renders cart message', () => {
    useStockStatusMessage.mockReturnValue({
        hasOutOfStockItem: true
    });
    const root = createTestInstance(<StockStatusMessage />);

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders null with no out of stock products', () => {
    useStockStatusMessage.mockReturnValue({ hasOutOfStockItem: false });
    const root = createTestInstance(<StockStatusMessage />);

    expect(root.toJSON()).toMatchSnapshot();
});
