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

test('input.submit.toString() returns the proper action type', () => {
    expect(actions.input.submit.toString()).toBe('CHECKOUT/INPUT/SUBMIT');
});

test('input.submit() returns a proper action object', () => {
    expect(actions.input.submit(payload)).toEqual({
        type: 'CHECKOUT/INPUT/SUBMIT',
        payload
    });
    expect(actions.input.submit(error)).toEqual({
        type: 'CHECKOUT/INPUT/SUBMIT',
        payload: error,
        error: true
    });
});

test('input.accept.toString() returns the proper action type', () => {
    expect(actions.input.accept.toString()).toBe('CHECKOUT/INPUT/ACCEPT');
});

test('input.accept() returns a proper action object', () => {
    expect(actions.input.accept(payload)).toEqual({
        type: 'CHECKOUT/INPUT/ACCEPT',
        payload
    });
    expect(actions.input.accept(error)).toEqual({
        type: 'CHECKOUT/INPUT/ACCEPT',
        payload: error,
        error: true
    });
});

test('input.reject.toString() returns the proper action type', () => {
    expect(actions.input.reject.toString()).toBe('CHECKOUT/INPUT/REJECT');
});

test('input.reject() returns a proper action object', () => {
    expect(actions.input.reject(payload)).toEqual({
        type: 'CHECKOUT/INPUT/REJECT',
        payload
    });
    expect(actions.input.reject(error)).toEqual({
        type: 'CHECKOUT/INPUT/REJECT',
        payload: error,
        error: true
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
