import React from 'react';
import waitForExpect from 'wait-for-expect';
import TestRenderer from 'react-test-renderer';
import { Form } from 'informed';

import CreateAccount from '../createAccount';
import { asyncValidators, validators } from '../validators';

jest.mock('../validators');

const submitCallback = jest.fn();

afterEach(() => {
    jest.clearAllMocks();
});

test('renders the correct tree', () => {
    const tree = TestRenderer.create(<CreateAccount />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('has a submit handler', () => {
    const { root } = TestRenderer.create(<CreateAccount />);

    const { instance } = root.children[0];

    expect(instance.handleSubmit).toBeInstanceOf(Function);
});

test('attaches the submit handler', () => {
    const { root } = TestRenderer.create(<CreateAccount />);

    const { instance } = root.children[0];
    const { onSubmit } = root.findByType(Form).props;

    expect(onSubmit).toBe(instance.handleSubmit);
});

test('executes validators on submit', async () => {
    const { root } = TestRenderer.create(<CreateAccount />);

    const form = root.findByType(Form);
    const { api } = form.instance.controller;

    // touch fields, call validators, call onSubmit
    api.submitForm();
    // await async validation
    await waitForExpect(() => {
        for (const validator of validators.values()) {
            expect(validator).toHaveBeenCalledTimes(1);
        }
        for (const validator of asyncValidators.values()) {
            expect(validator).toHaveBeenCalledTimes(1);
        }
    });
});

test('calls onSubmit if validation passes', async () => {
    const { root } = TestRenderer.create(
        <CreateAccount onSubmit={submitCallback} />
    );

    const form = root.findByType(Form);
    const { api } = form.instance.controller;

    // touch fields, call validators, call onSubmit
    api.submitForm();
    // await async validation
    await waitForExpect(() => {
        const { asyncErrors, errors } = form.instance.controller.state;

        expect(Object.keys(asyncErrors)).toHaveLength(0);
        expect(Object.keys(errors)).toHaveLength(0);
        expect(submitCallback).toHaveBeenCalledTimes(1);
    });
});
