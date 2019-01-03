import React from 'react';
import { shallow } from 'enzyme';
import { Form } from 'informed';

import Button from 'src/components/Button';
import ForgotPasswordForm from '../forgotPasswordForm';

test('renders correctly', () => {
    const emailInputProps = { field: 'email' };
    const wrapper = shallow(<ForgotPasswordForm onSubmit={() => {}} />).dive();

    expect(wrapper.find(emailInputProps)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
});

test('calls onSubmit callback', () => {
    const onSubmit = jest.fn();
    const wrapper = shallow(<ForgotPasswordForm onSubmit={onSubmit} />).dive();

    wrapper.find(Form).simulate('submit');

    expect(onSubmit).toBeCalled();
});
