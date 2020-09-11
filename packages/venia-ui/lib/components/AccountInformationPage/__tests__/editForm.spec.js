import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditForm from '../editForm';

jest.mock('../../../classify');

const showChangePassword = jest.fn().mockName('showChangePassword');

const mockProps = {
    showChangePassword,
    isChangingPassword: false
};

test('renders form', () => {
    const tree = createTestInstance(<EditForm {...mockProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form with password fields', () => {
    const props = {
        ...mockProps,
        isChangingPassword: true
    };
    const tree = createTestInstance(<EditForm {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
