import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { Form } from 'informed';

import ForgotPasswordForm from '../forgotPasswordForm';

jest.mock('../../../../classify');

test('renders correctly', () => {
    const wrapper = createTestInstance(
        <ForgotPasswordForm onSubmit={() => {}} />
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('calls onSubmit callback', () => {
    const onSubmit = jest.fn();
    const wrapper = createTestInstance(
        <ForgotPasswordForm onSubmit={onSubmit} />
    );
    wrapper.root.findByType(Form).props.onSubmit();

    expect(onSubmit).toBeCalled();
});
