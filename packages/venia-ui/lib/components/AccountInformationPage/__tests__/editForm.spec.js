import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import EditForm from '../editForm';

jest.mock('../../../classify');

const defaultProps = {
    handleChangePassword: jest.fn(),
    shouldShowNewPassword: false
};

test('renders form when shouldShowNewPassword is false', () => {
    const props = {
        ...defaultProps,
        shouldShowNewPassword: false
    };

    const tree = createTestInstance(
        <Form>
            <EditForm {...props} />
        </Form>
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form when shouldShowNewPassword is true ', () => {
    const props = {
        ...defaultProps,
        shouldShowNewPassword: true
    };

    const tree = createTestInstance(
        <Form>
            <EditForm {...props} />
        </Form>
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
