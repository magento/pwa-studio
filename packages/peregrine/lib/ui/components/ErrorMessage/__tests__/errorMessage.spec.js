import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ErrorMessage from '../errorMessage';

jest.mock('../../../classify');

const props = {
    children: 'Unit Test Error Message'
};

test('renders an Error message', () => {
    // Act.
    const wrapper = createTestInstance(<ErrorMessage {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
