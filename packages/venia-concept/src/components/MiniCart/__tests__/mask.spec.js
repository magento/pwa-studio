import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import MiniCartMask from '../mask';

jest.mock('src/components/Mask', () => ({
    __esModule: true,
    default: () => '( Shared Mask Component Here )'
}));

test('it renders the shared Mask component', () => {
    const tree = createTestInstance(<MiniCartMask />).toJSON();

    expect(tree).toMatchSnapshot();
});
