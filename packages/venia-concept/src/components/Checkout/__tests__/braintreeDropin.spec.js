// NPM.
import React from 'react';
import TestRenderer from 'react-test-renderer';
import dropin from 'braintree-web-drop-in';
jest.mock('braintree-web-drop-in');

// Local.
import BraintreeDropin from '../braintreeDropin';

// Mock underlying braintree-web-drop-in functions.
const mockCreate = jest.fn(() => {
    return Promise.resolve({});
});

// Mock our component props.
const mockError = jest.fn();
const mockSuccess = jest.fn();
const props = {
    onError: mockError,
    onSuccess: mockSuccess
};

beforeAll(() => {
    dropin.create = mockCreate;
});

beforeEach(() => {
    // We clear this mock so we don't blow away the implementation.
    mockCreate.mockClear();

    mockError.mockReset();
    mockSuccess.mockReset();
});

test('renders a single div', () => {
    const { root } = TestRenderer.create(<BraintreeDropin {...props} />);

    expect(root.findAllByType('div')).toHaveLength(1);
});

test('creates an instance of the underlying dropin on mount', () => {
    TestRenderer.create(<BraintreeDropin {...props} />);

    expect(mockCreate).toBeCalledTimes(1);
});
