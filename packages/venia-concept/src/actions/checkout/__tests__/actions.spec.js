import actions from '../actions';

const payload = 'FOO';
const error = new Error('BAR');

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

test('cart.submit.toString() returns the proper action type', () => {
    expect(actions.cart.submit.toString()).toBe('CHECKOUT/CART/SUBMIT');
});

test('cart.submit() returns a proper action object', () => {
    expect(actions.cart.submit(payload)).toEqual({
        type: 'CHECKOUT/CART/SUBMIT',
        payload
    });
    expect(actions.cart.submit(error)).toEqual({
        type: 'CHECKOUT/CART/SUBMIT',
        payload: error,
        error: true
    });
});

test('cart.accept.toString() returns the proper action type', () => {
    expect(actions.cart.accept.toString()).toBe('CHECKOUT/CART/ACCEPT');
});

test('cart.accept() returns a proper action object', () => {
    expect(actions.cart.accept(payload)).toEqual({
        type: 'CHECKOUT/CART/ACCEPT',
        payload
    });
    expect(actions.cart.accept(error)).toEqual({
        type: 'CHECKOUT/CART/ACCEPT',
        payload: error,
        error: true
    });
});

test('cart.reject.toString() returns the proper action type', () => {
    expect(actions.cart.reject.toString()).toBe('CHECKOUT/CART/REJECT');
});

test('cart.reject() returns a proper action object', () => {
    expect(actions.cart.reject(payload)).toEqual({
        type: 'CHECKOUT/CART/REJECT',
        payload
    });
    expect(actions.cart.reject(error)).toEqual({
        type: 'CHECKOUT/CART/REJECT',
        payload: error,
        error: true
    });
});
