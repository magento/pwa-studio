import React, { useState } from 'react';
import { createTestInstance } from '@magento/peregrine';
import waitForExpect from 'wait-for-expect';
import dropin from 'braintree-web-drop-in';

import BraintreeDropin from '../braintreeDropin';

jest.mock('../../../classify');
jest.mock('@magento/peregrine', () => ({
    ...jest.requireActual('@magento/peregrine'),
    Util: {
        BrowserPersistence: function() {
            return {
                getItem: jest
                    .fn()
                    .mockReturnValueOnce({ data: 'storedData' })
                    .mockReturnValueOnce(null)
            };
        }
    }
}));

jest.mock('react', () => {
    const React = jest.requireActual('react');

    return Object.assign(React, { useState: jest.fn(React.useState) });
});

// Mock our component props.
const mockError = jest.fn();
const mockSuccess = jest.fn();
const defaultProps = {
    onError: mockError,
    onSuccess: mockSuccess
};

beforeEach(() => {
    mockError.mockReset();
    mockSuccess.mockReset();
});

test('renders two divs', () => {
    const { root } = createTestInstance(<BraintreeDropin {...defaultProps} />);

    expect(root.findAllByType('div')).toHaveLength(2);
});

test('renders an error if isError state is true', async () => {
    dropin.create.mockImplementation(() => {
        throw new Error();
    });

    const component = createTestInstance(<BraintreeDropin {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('creates an instance of the underlying dropin on mount', async () => {
    createTestInstance(<BraintreeDropin {...defaultProps} />);

    await waitForExpect(() => {
        expect(dropin.create).toHaveProperty('mock');
        expect(dropin.create).toHaveBeenCalledTimes(1);
    });
});

test('returns paymentNonce', async () => {
    const props = {
        ...defaultProps,
        shouldRequestPaymentNonce: true
    };
    const nonce = 'imanonce';

    useState.mockReturnValue([
        {
            requestPaymentMethod: jest.fn().mockImplementation(() => nonce)
        },
        jest.fn()
    ]);

    createTestInstance(<BraintreeDropin {...props} />);

    await waitForExpect(() => {
        expect(mockSuccess).toHaveBeenCalledWith(nonce);
    });
});

test('throws an error on failure to get payment nonce', async () => {
    const props = {
        ...defaultProps,
        shouldRequestPaymentNonce: true
    };
    useState.mockReturnValue([
        {
            requestPaymentMethod: jest.fn().mockImplementation(() => {
                throw new Error();
            })
        },
        jest.fn()
    ]);

    createTestInstance(<BraintreeDropin {...props} />);

    await waitForExpect(() => {
        expect(mockError).toHaveBeenCalled();
    });
});
