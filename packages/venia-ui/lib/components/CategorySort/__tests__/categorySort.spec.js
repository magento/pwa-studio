import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import CategorySort from '../../CategorySort/categorySort';

const props = {
    sortControl: {
        currentSort: {
            sortAttribute: 'relevance',
            sortDirection: 'ASC'
        },
        setSort: jest.fn()
    }
};

test('renders correctly', () => {
    const instance = createTestInstance(<CategorySort {...props} />);
    expect(instance.toJSON()).toMatchSnapshot();
});
