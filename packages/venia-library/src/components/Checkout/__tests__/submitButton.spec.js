import React from 'react';
import testRenderer from 'react-test-renderer';
import SubmitButton from '../submitButton';

test('renders a SubmitButton component', () => {
    const props = {
        submitOrder: jest.fn(),
        submitting: false,
        valid: false
    };
    const component = testRenderer.create(<SubmitButton {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('sets disabled true if submitting', () => {
    const props = {
        submitOrder: jest.fn(),
        submitting: true,
        valid: false
    };
    const component = testRenderer.create(<SubmitButton {...props} />);
    expect(component.toJSON().props.disabled).toBe(true);
});

test('sets disabled true if not submitting and not valid', () => {
    const props = {
        submitOrder: jest.fn(),
        submitting: false,
        valid: false
    };
    const component = testRenderer.create(<SubmitButton {...props} />);
    expect(component.toJSON().props.disabled).toBe(true);
});

test('sets disabled false if not submitting and valid', () => {
    const props = {
        submitOrder: jest.fn(),
        submitting: false,
        valid: true
    };
    const component = testRenderer.create(<SubmitButton {...props} />);
    expect(component.toJSON().props.disabled).toBe(false);
});
