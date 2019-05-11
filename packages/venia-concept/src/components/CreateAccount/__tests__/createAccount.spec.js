import React from 'react';
import { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';

jest.mock('src/util/formValidators');

export const submitCallback = jest.fn();

test('renders the correct tree', () => {
    const tree = createTestInstance(<CreateAccount />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('has a submit handler', () => {
    const { root } = createTestInstance(<CreateAccount />);

    const { instance } = root.children[0];

    expect(instance.handleSubmit).toBeInstanceOf(Function);
});

test('attaches the submit handler', () => {
    const { root } = createTestInstance(<CreateAccount />);

    const { instance } = root.children[0];
    const { onSubmit } = root.findByType(Form).props;

    expect(onSubmit).toBe(instance.handleSubmit);
});

test('calls onSubmit if validation passes', async () => {
    const { root } = createTestInstance(
        <CreateAccount onSubmit={submitCallback} />
    );

    const form = root.findByType(Form);
    const { formApi } = form.instance;

    // touch fields, call validators, call onSubmit
    act(() => {
        formApi.submitForm();
    });

    // await async validation
    await waitForExpect(() => {
        const { errors } = form.instance.controller.state;

        expect(Object.keys(errors)).toHaveLength(0);
        expect(submitCallback).toHaveBeenCalledTimes(1);
    });
});
