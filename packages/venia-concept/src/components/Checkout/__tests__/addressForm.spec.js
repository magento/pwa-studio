import React from 'react';
import waitForExpect from 'wait-for-expect';
import TestRenderer from 'react-test-renderer';
import { Form } from 'informed';

import AddressForm from '../addressForm';
import validators  from '../validators';

jest.mock('../validators');

afterEach(() => {
    jest.clearAllMocks();
});


test('executes validators on submit', async () => {
    const { root } = TestRenderer.create(<AddressForm initialValues={[]} cancel={jest.fn()} submit={jest.fn()} />);

    const form = root.findByType(Form);
    const { api } = form.instance.controller;

    // touch fields, call validators, call onSubmit
    api.submitForm();
    // await async validation
    await waitForExpect(() => {
        for (const validator of validators.values()) {
            expect(validator).toHaveBeenCalledTimes(1);
        }
    });
});
