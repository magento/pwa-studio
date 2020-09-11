import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditForm from '../editForm';

jest.mock('../../../classify');
jest.mock('../../FormError', () => 'FormError');

const onCancelModal = jest.fn().mockName('onCancelModal');
const handleSubmit = jest.fn().mockName('handleSubmit');
const handleChangePassword = jest.fn().mockName('handleChangePassword');
const mockProps = {
    formErrors: new Map(),
    onCancelModal,
    handleSubmit,
    handleChangePassword,
    isChangingPassword: false,
    isDisabled: false,
    informationData: {
        firtname: 'Foo',
        lastname: 'Bar',
        email: 'foobar@express.net'
    }
};

test('renders empty form without data', () => {
    const tree = createTestInstance(<EditForm {...mockProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form error', () => {
    const formErrors = new Map([['error', new Error('Form Error')]]);

    const tree = createTestInstance(
        <EditForm {...mockProps} formErrors={formErrors} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

describe('renders prefilled form with data', () => {
    const informationData = {
        email: 'barfoo@express.net',
        firstname: 'Bar',
        lastname: 'Foo'
    };

    test('with enabled change password form', () => {
        const newProps = {
            ...mockProps,
            informationData,
            isChangingPassword: true
        };

        const tree = createTestInstance(<EditForm {...newProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with disabled buttons', () => {
        const newProps = { ...mockProps, informationData, isDisabled: true };

        const tree = createTestInstance(<EditForm {...newProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
