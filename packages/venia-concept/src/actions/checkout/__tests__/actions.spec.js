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

describe('address', () => {
    test('address.submit.toString() returns the proper action type', () => {
        expect(actions.address.submit.toString()).toBe(
            'CHECKOUT/ADDRESS/SUBMIT'
        );
    });

    test('address.submit() returns a proper action object', () => {
        expect(actions.address.submit(payload)).toEqual({
            type: 'CHECKOUT/ADDRESS/SUBMIT',
            payload
        });
        expect(actions.address.submit(error)).toEqual({
            type: 'CHECKOUT/ADDRESS/SUBMIT',
            payload: error,
            error: true
        });
    });

    test('address.accept.toString() returns the proper action type', () => {
        expect(actions.address.accept.toString()).toBe(
            'CHECKOUT/ADDRESS/ACCEPT'
        );
    });

    test('address.accept() returns a proper action object', () => {
        expect(actions.address.accept(payload)).toEqual({
            type: 'CHECKOUT/ADDRESS/ACCEPT',
            payload
        });
        expect(actions.address.accept(error)).toEqual({
            type: 'CHECKOUT/ADDRESS/ACCEPT',
            payload: error,
            error: true
        });
    });

    test('address.reject.toString() returns the proper action type', () => {
        expect(actions.address.reject.toString()).toBe(
            'CHECKOUT/ADDRESS/REJECT'
        );
    });

    test('address.reject() returns a proper action object', () => {
        expect(actions.address.reject(payload)).toEqual({
            type: 'CHECKOUT/ADDRESS/REJECT',
            payload
        });
        expect(actions.address.reject(error)).toEqual({
            type: 'CHECKOUT/ADDRESS/REJECT',
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
