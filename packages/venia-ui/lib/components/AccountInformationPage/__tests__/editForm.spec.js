import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditForm from '../editForm';

jest.mock('../../../classify');

test('renders form', () => {
    const tree = createTestInstance(<EditForm />);
    expect(tree.toJSON()).toMatchSnapshot();
});
