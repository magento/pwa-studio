import actions from '../actions';

const payload = 'PAYLOAD';
const error = new Error('ERROR');

test('begin.toString() returns the proper action type', () => {
    expect(actions.begin.toString()).toBe('CHECKOUT/BEGIN');
});

test('begin() returns a proper action object', () => {
    expect(actions.begin(payload)).toEqual({ type: 'CHECKOUT/BEGIN', payload });
    expect(actions.begin(error)).toEqual({
        type: 'CHECKOUT/BEGIN',
        payload: error,
        error: true
    });
});

test('edit.toString() returns the proper action type', () => {
    expect(actions.edit.toString()).toBe('CHECKOUT/EDIT');
});

test('edit() returns a proper action object', () => {
    expect(actions.edit(payload)).toEqual({ type: 'CHECKOUT/EDIT', payload });
    expect(actions.edit(error)).toEqual({
        type: 'CHECKOUT/EDIT',
        payload: error,
        error: true
    });
});

test('reset.toString() returns the proper action type', () => {
    expect(actions.reset.toString()).toBe('CHECKOUT/RESET');
});

test('reset() returns a proper action object', () => {
    expect(actions.reset(payload)).toEqual({ type: 'CHECKOUT/RESET', payload });
    expect(actions.reset(error)).toEqual({
        type: 'CHECKOUT/RESET',
        payload: error,
        error: true
    });
});

describe('billingAddress', () => {
    test('billingAddress.submit.toString() returns the proper action type', () => {
        expect(actions.billingAddress.submit.toString()).toBe(
            'CHECKOUT/BILLING_ADDRESS/SUBMIT'
        );
    });

    test('billingAddress.submit() returns a proper action object', () => {
        expect(actions.billingAddress.submit(payload)).toEqual({
            type: 'CHECKOUT/BILLING_ADDRESS/SUBMIT',
            payload
        });
        expect(actions.billingAddress.submit(error)).toEqual({
            type: 'CHECKOUT/BILLING_ADDRESS/SUBMIT',
            payload: error,
            error: true
        });
    });

    test('billingAddress.accept.toString() returns the proper action type', () => {
        expect(actions.billingAddress.accept.toString()).toBe(
            'CHECKOUT/BILLING_ADDRESS/ACCEPT'
        );
    });

    test('billingAddress.accept() returns a proper action object', () => {
        expect(actions.billingAddress.accept(payload)).toEqual({
            type: 'CHECKOUT/BILLING_ADDRESS/ACCEPT',
            payload
        });
        expect(actions.billingAddress.accept(error)).toEqual({
            type: 'CHECKOUT/BILLING_ADDRESS/ACCEPT',
            payload: error,
            error: true
        });
    });

    test('billingAddress.reject.toString() returns the proper action type', () => {
        expect(actions.billingAddress.reject.toString()).toBe(
            'CHECKOUT/BILLING_ADDRESS/REJECT'
        );
    });

    test('billingAddress.reject() returns a proper action object', () => {
        expect(actions.billingAddress.reject(payload)).toEqual({
            type: 'CHECKOUT/BILLING_ADDRESS/REJECT',
            payload
        });
        expect(actions.billingAddress.reject(error)).toEqual({
            type: 'CHECKOUT/BILLING_ADDRESS/REJECT',
            payload: error,
            error: true
        });
    });
});

describe('shippingAddress', () => {
    test('shippingAddress.submit.toString() returns the proper action type', () => {
        expect(actions.shippingAddress.submit.toString()).toBe(
            'CHECKOUT/SHIPPING_ADDRESS/SUBMIT'
        );
    });

    test('shippingAddress.submit() returns a proper action object', () => {
        expect(actions.shippingAddress.submit(payload)).toEqual({
            type: 'CHECKOUT/SHIPPING_ADDRESS/SUBMIT',
            payload
        });
        expect(actions.shippingAddress.submit(error)).toEqual({
            type: 'CHECKOUT/SHIPPING_ADDRESS/SUBMIT',
            payload: error,
            error: true
        });
    });

    test('shippingAddress.accept.toString() returns the proper action type', () => {
        expect(actions.shippingAddress.accept.toString()).toBe(
            'CHECKOUT/SHIPPING_ADDRESS/ACCEPT'
        );
    });

    test('shippingAddress.accept() returns a proper action object', () => {
        expect(actions.shippingAddress.accept(payload)).toEqual({
            type: 'CHECKOUT/SHIPPING_ADDRESS/ACCEPT',
            payload
        });
        expect(actions.shippingAddress.accept(error)).toEqual({
            type: 'CHECKOUT/SHIPPING_ADDRESS/ACCEPT',
            payload: error,
            error: true
        });
    });

    test('shippingAddress.reject.toString() returns the proper action type', () => {
        expect(actions.shippingAddress.reject.toString()).toBe(
            'CHECKOUT/SHIPPING_ADDRESS/REJECT'
        );
    });

    test('shippingAddress.reject() returns a proper action object', () => {
        expect(actions.shippingAddress.reject(payload)).toEqual({
            type: 'CHECKOUT/SHIPPING_ADDRESS/REJECT',
            payload
        });
        expect(actions.shippingAddress.reject(error)).toEqual({
            type: 'CHECKOUT/SHIPPING_ADDRESS/REJECT',
            payload: error,
            error: true
        });
    });
});

describe('paymentMethod', () => {
    test('paymentMethod.submit.toString() returns the proper action type', () => {
        expect(actions.paymentMethod.submit.toString()).toBe(
            'CHECKOUT/PAYMENT_METHOD/SUBMIT'
        );
    });

    test('paymentMethod.submit() returns a proper action object', () => {
        expect(actions.paymentMethod.submit(payload)).toEqual({
            type: 'CHECKOUT/PAYMENT_METHOD/SUBMIT',
            payload
        });
        expect(actions.paymentMethod.submit(error)).toEqual({
            type: 'CHECKOUT/PAYMENT_METHOD/SUBMIT',
            payload: error,
            error: true
        });
    });

    test('paymentMethod.accept.toString() returns the proper action type', () => {
        expect(actions.paymentMethod.accept.toString()).toBe(
            'CHECKOUT/PAYMENT_METHOD/ACCEPT'
        );
    });

    test('paymentMethod.accept() returns a proper action object', () => {
        expect(actions.paymentMethod.accept(payload)).toEqual({
            type: 'CHECKOUT/PAYMENT_METHOD/ACCEPT',
            payload
        });
        expect(actions.paymentMethod.accept(error)).toEqual({
            type: 'CHECKOUT/PAYMENT_METHOD/ACCEPT',
            payload: error,
            error: true
        });
    });

    test('paymentMethod.reject.toString() returns the proper action type', () => {
        expect(actions.paymentMethod.reject.toString()).toBe(
            'CHECKOUT/PAYMENT_METHOD/REJECT'
        );
    });

    test('paymentMethod.reject() returns a proper action object', () => {
        expect(actions.paymentMethod.reject(payload)).toEqual({
            type: 'CHECKOUT/PAYMENT_METHOD/REJECT',
            payload
        });
        expect(actions.paymentMethod.reject(error)).toEqual({
            type: 'CHECKOUT/PAYMENT_METHOD/REJECT',
            payload: error,
            error: true
        });
    });
});

describe('getShippingMethods', () => {
    test('getShippingMethods.request.toString() returns the proper action type', () => {
        expect(actions.getShippingMethods.request.toString()).toBe(
            'CHECKOUT/GET_SHIPPING_METHODS/REQUEST'
        );
    });

    test('getShippingMethods.request() returns a proper action object', () => {
        expect(actions.getShippingMethods.request(payload)).toEqual({
            type: 'CHECKOUT/GET_SHIPPING_METHODS/REQUEST',
            payload
        });
    });

    test('getShippingMethods.receive.toString() returns the proper action type', () => {
        expect(actions.getShippingMethods.receive.toString()).toBe(
            'CHECKOUT/GET_SHIPPING_METHODS/RECEIVE'
        );
    });

    test('getShippingMethods.receive() returns a proper action object', () => {
        expect(actions.getShippingMethods.receive(payload)).toEqual({
            type: 'CHECKOUT/GET_SHIPPING_METHODS/RECEIVE',
            payload
        });
        expect(actions.getShippingMethods.receive(error)).toEqual({
            type: 'CHECKOUT/GET_SHIPPING_METHODS/RECEIVE',
            payload: error,
            error: true
        });
    });
});

describe('shippingMethod', () => {
    test('shippingMethod.submit.toString() returns the proper action type', () => {
        expect(actions.shippingMethod.submit.toString()).toBe(
            'CHECKOUT/SHIPPING_METHOD/SUBMIT'
        );
    });

    test('shippingMethod.submit() returns a proper action object', () => {
        expect(actions.shippingMethod.submit(payload)).toEqual({
            type: 'CHECKOUT/SHIPPING_METHOD/SUBMIT',
            payload
        });
        expect(actions.shippingMethod.submit(error)).toEqual({
            type: 'CHECKOUT/SHIPPING_METHOD/SUBMIT',
            payload: error,
            error: true
        });
    });

    test('shippingMethod.accept.toString() returns the proper action type', () => {
        expect(actions.shippingMethod.accept.toString()).toBe(
            'CHECKOUT/SHIPPING_METHOD/ACCEPT'
        );
    });

    test('shippingMethod.accept() returns a proper action object', () => {
        expect(actions.shippingMethod.accept(payload)).toEqual({
            type: 'CHECKOUT/SHIPPING_METHOD/ACCEPT',
            payload
        });
        expect(actions.shippingMethod.accept(error)).toEqual({
            type: 'CHECKOUT/SHIPPING_METHOD/ACCEPT',
            payload: error,
            error: true
        });
    });

    test('shippingMethod.reject.toString() returns the proper action type', () => {
        expect(actions.shippingMethod.reject.toString()).toBe(
            'CHECKOUT/SHIPPING_METHOD/REJECT'
        );
    });

    test('shippingMethod.reject() returns a proper action object', () => {
        expect(actions.shippingMethod.reject(payload)).toEqual({
            type: 'CHECKOUT/SHIPPING_METHOD/REJECT',
            payload
        });
        expect(actions.shippingMethod.reject(error)).toEqual({
            type: 'CHECKOUT/SHIPPING_METHOD/REJECT',
            payload: error,
            error: true
        });
    });
});

test('order.submit.toString() returns the proper action type', () => {
    expect(actions.order.submit.toString()).toBe('CHECKOUT/ORDER/SUBMIT');
});

test('order.submit() returns a proper action object', () => {
    expect(actions.order.submit(payload)).toEqual({
        type: 'CHECKOUT/ORDER/SUBMIT',
        payload
    });
    expect(actions.order.submit(error)).toEqual({
        type: 'CHECKOUT/ORDER/SUBMIT',
        payload: error,
        error: true
    });
});

test('order.accept.toString() returns the proper action type', () => {
    expect(actions.order.accept.toString()).toBe('CHECKOUT/ORDER/ACCEPT');
});

test('order.accept() returns a proper action object', () => {
    expect(actions.order.accept(payload)).toEqual({
        type: 'CHECKOUT/ORDER/ACCEPT',
        payload
    });
    expect(actions.order.accept(error)).toEqual({
        type: 'CHECKOUT/ORDER/ACCEPT',
        payload: error,
        error: true
    });
});

test('order.reject.toString() returns the proper action type', () => {
    expect(actions.order.reject.toString()).toBe('CHECKOUT/ORDER/REJECT');
});

test('order.reject() returns a proper action object', () => {
    expect(actions.order.reject(payload)).toEqual({
        type: 'CHECKOUT/ORDER/REJECT',
        payload
    });
    expect(actions.order.reject(error)).toEqual({
        type: 'CHECKOUT/ORDER/REJECT',
        payload: error,
        error: true
    });
});
