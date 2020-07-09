import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import MiniCart from '../miniCart';

jest.mock('../../../classify');

test('it renders correctly', () => {
    // Arrange.
    const props = {
        isOpen: true
    };

    // Act.
    const instance = createTestInstance(<MiniCart {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
