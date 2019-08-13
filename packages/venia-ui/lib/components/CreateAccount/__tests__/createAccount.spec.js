import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';

jest.mock('../../../util/formValidators');

const props = {
    createAccount: jest.fn()
};

test('renders the correct tree', () => {
    const tree = createTestInstance(<CreateAccount {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('has a submit handler', () => {
    const { root } = createTestInstance(<CreateAccount {...props} />);

    const { instance } = root.children[0];

    expect(instance.handleSubmit).toBeInstanceOf(Function);
});

test('attaches the submit handler', () => {
    const { root } = createTestInstance(<CreateAccount {...props} />);

    const { instance } = root.children[0];
    const { onSubmit } = root.findByType(Form).props;

    expect(onSubmit).toBe(instance.handleSubmit);
});

test('calls onSubmit if validation passes', async () => {
    const { root } = createTestInstance(<CreateAccount {...props} />);

    const form = root.findByType(Form);
    const { formApi } = form.instance;

    // touch fields, call validators, call onSubmit
    await act(() => {
        formApi.submitForm();
    });

    const { errors } = root.findByType(Form).instance.controller.state;

    expect(Object.keys(errors)).toHaveLength(0);
    expect(props.createAccount).toHaveBeenCalledTimes(1);
});
