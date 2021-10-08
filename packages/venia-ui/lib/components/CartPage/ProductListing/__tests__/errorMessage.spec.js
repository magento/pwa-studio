import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ErrorMessage from '../errorMessage';

jest.mock('../../../../classify');

test('renders error message', () => {
    const error = new Error('Something went wrong.');
    const tree = createTestInstance(<ErrorMessage error={error} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing when no error', () => {
    const error = null;
    const tree = createTestInstance(<ErrorMessage error={error} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
