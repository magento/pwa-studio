import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ProductSort from '../../ProductSort';

test('renders correctly', () => {
    const sortProps = [
        { sortDirection: '', sortAttribute: '', sortText: '' },
        jest.fn()
    ];
    const instance = createTestInstance(<ProductSort sortProps={sortProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});
