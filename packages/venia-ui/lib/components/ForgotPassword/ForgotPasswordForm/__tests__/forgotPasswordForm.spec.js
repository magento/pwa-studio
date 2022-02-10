import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { Form } from 'informed';

import ForgotPasswordForm from '../forgotPasswordForm';

jest.mock('../../../../classify');

test('renders when not busy', () => {
    const wrapper = createTestInstance(
        <ForgotPasswordForm
            isResettingPassword={false}
            onCancel={() => {}}
            onSubmit={() => {}}
        />
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders when busy', () => {
    const wrapper = createTestInstance(
        <ForgotPasswordForm
            isResettingPassword={true}
            onCancel={() => {}}
            onSubmit={() => {}}
        />
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('calls onSubmit callback', () => {
    const onSubmit = jest.fn();
    const wrapper = createTestInstance(
        <ForgotPasswordForm
            isResettingPassword={false}
            onCancel={() => {}}
            onSubmit={onSubmit}
        />
    );
    wrapper.root.findByType(Form).props.onSubmit();

    expect(onSubmit).toBeCalled();
});
