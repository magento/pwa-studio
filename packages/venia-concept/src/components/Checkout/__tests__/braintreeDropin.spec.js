import React from 'react';
import TestRenderer from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import dropin from 'braintree-web-drop-in';

import BraintreeDropin from '../braintreeDropin';

// Mock our component props.
const mockError = jest.fn();
const mockSuccess = jest.fn();
const props = {
    onError: mockError,
    onSuccess: mockSuccess
};

test('renders two divs', () => {
    const { root } = TestRenderer.create(<BraintreeDropin {...props} />);

    expect(root.findAllByType('div')).toHaveLength(2);
});

test('creates an instance of the underlying dropin on mount', async () => {
    TestRenderer.create(<BraintreeDropin {...props} />);

    await waitForExpect(() => {
        expect(dropin.create).toHaveProperty('mock');
        expect(dropin.create).toHaveBeenCalledTimes(1);
    });
});
