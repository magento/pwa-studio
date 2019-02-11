import React from 'react';
import TestRenderer from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import dropin from 'braintree-web-drop-in';

import BraintreeDropin from '../braintreeDropin';

jest.mock('src/classify');
jest.mock('@magento/peregrine', () => ({
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

// Mock our component props.
const mockError = jest.fn();
const mockSuccess = jest.fn();
const props = {
    onError: mockError,
    onSuccess: mockSuccess
};

beforeEach(() => {
    mockError.mockReset();
    mockSuccess.mockReset();
});

test('renders two divs', () => {
    const { root } = TestRenderer.create(<BraintreeDropin {...props} />);

    expect(root.findAllByType('div')).toHaveLength(2);
});

test('renders an error if isError state is true', () => {
    const component = TestRenderer.create(<BraintreeDropin {...props} />);
    component.root.children[0].instance.createDropinInstance = jest
        .fn()
        .mockImplementation(() => {
            throw new Error();
        });
    component.root.children[0].instance.componentDidMount();
    expect(component.toJSON()).toMatchSnapshot();
});

test('creates an instance of the underlying dropin on mount', async () => {
    TestRenderer.create(<BraintreeDropin {...props} />);

    await waitForExpect(() => {
        expect(dropin.create).toHaveProperty('mock');
        expect(dropin.create).toHaveBeenCalledTimes(1);
    });
});

test('returns paymentNonce', async () => {
    const component = TestRenderer.create(<BraintreeDropin {...props} />);
    const nonce = 'imanonce';
    component.root.children[0].instance.dropinInstance = {
        requestPaymentMethod: jest.fn().mockImplementation(() => nonce)
    };
    await component.root.children[0].instance.requestPaymentNonce();

    expect(mockSuccess).toHaveBeenCalledWith(nonce);
});

test('returns stored payment info on failure to get payment nonce', async () => {
    const component = TestRenderer.create(<BraintreeDropin {...props} />);
    component.root.children[0].instance.dropinInstance = {
        requestPaymentMethod: jest.fn().mockImplementation(() => {
            throw new Error();
        })
    };
    await component.root.children[0].instance.requestPaymentNonce();

    expect(mockSuccess).toHaveBeenCalledWith('storedData');
});

test('throws an error on failure to get payment nonce and no stored payment info', async () => {
    const component = TestRenderer.create(<BraintreeDropin {...props} />);
    component.root.children[0].instance.dropinInstance = {
        requestPaymentMethod: jest.fn().mockImplementation(() => {
            throw new Error();
        })
    };
    await component.root.children[0].instance.requestPaymentNonce();

    expect(mockError).toHaveBeenCalled();
});

test('requests the payment nonce if instructed by parent', () => {
    const component = TestRenderer.create(
        <BraintreeDropin
            isRequestingPaymentNonce={true}
            onError={mockError}
            onSuccess={mockSuccess}
        />
    );

    const mockRequestPaymentNonce = jest.fn();
    component.root.children[0].instance.requestPaymentNonce = mockRequestPaymentNonce;
    component.root.children[0].instance.dropinInstance = true;
    component.root.children[0].instance.componentDidUpdate({
        isRequestingPaymentNonce: false
    });

    expect(mockRequestPaymentNonce).toHaveBeenCalled();
});
