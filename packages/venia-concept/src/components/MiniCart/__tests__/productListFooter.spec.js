import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductListFooter from '../productListFooter';

jest.mock('../totalsSummary');
jest.mock('src/components/Checkout', () => {
    return jest.fn().mockReturnValue('( Checkout Component Here )');
});
jest.mock('src/components/Checkout/checkoutButton', () => {
    return jest.fn().mockReturnValue('( Checkout Button Component Here )');
});

test('renders totals summary and checkout components', () => {
    const props = {};
    const tree = createTestInstance(<ProductListFooter {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
