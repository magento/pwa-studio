import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import OrderProgressBar from '../orderProgressBar';

jest.mock('../../../classify');

test('it renders steps', () => {
    const tree = createTestInstance(
        <OrderProgressBar status={'Ready to ship'} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
