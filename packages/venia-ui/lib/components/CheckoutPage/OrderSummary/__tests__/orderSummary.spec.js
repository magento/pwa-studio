import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import OrderSummary from '../orderSummary';

jest.mock('../../../../classify');
jest.mock('../../../CartPage/PriceSummary', () => 'PriceSummary');

test('renders order summary', () => {
    const mockIsUpdating = jest.fn().mockName('isUpdating');
    const tree = createTestInstance(
        <OrderSummary isUpdating={mockIsUpdating} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
