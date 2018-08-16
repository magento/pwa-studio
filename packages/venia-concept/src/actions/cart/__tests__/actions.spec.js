import actions from '../actions';

const payload = 'FOO';
const error = new Error('BAR');

test('addItem.toString() returns the proper action type', () => {
    expect(actions.addItem.toString()).toBe('CART/ADD_ITEM');
});

test('addItem() returns a proper action object', () => {
    expect(actions.addItem(payload)).toEqual({
        type: 'CART/ADD_ITEM',
        payload
    });
    expect(actions.addItem(error)).toEqual({
        type: 'CART/ADD_ITEM',
        payload: error,
        error: true
    });
});

test('requestGuestCart.toString() returns the proper action type', () => {
    expect(actions.requestGuestCart.toString()).toBe('CART/REQUEST_GUEST_CART');
});

test('requestGuestCart() returns a proper action object', () => {
    expect(actions.requestGuestCart(payload)).toEqual({
        type: 'CART/REQUEST_GUEST_CART',
        payload
    });
    expect(actions.requestGuestCart(error)).toEqual({
        type: 'CART/REQUEST_GUEST_CART',
        payload: error,
        error: true
    });
});

test('receiveGuestCart.toString() returns the proper action type', () => {
    expect(actions.receiveGuestCart.toString()).toBe('CART/RECEIVE_GUEST_CART');
});

test('receiveGuestCart() returns a proper action object', () => {
    expect(actions.receiveGuestCart(payload)).toEqual({
        type: 'CART/RECEIVE_GUEST_CART',
        payload
    });
    expect(actions.receiveGuestCart(error)).toEqual({
        type: 'CART/RECEIVE_GUEST_CART',
        payload: error,
        error: true
    });
});

test('requestDetails.toString() returns the proper action type', () => {
    expect(actions.requestDetails.toString()).toBe('CART/REQUEST_DETAILS');
});

test('requestDetails() returns a proper action object', () => {
    expect(actions.requestDetails(payload)).toEqual({
        type: 'CART/REQUEST_DETAILS',
        payload
    });
    expect(actions.requestDetails(error)).toEqual({
        type: 'CART/REQUEST_DETAILS',
        payload: error,
        error: true
    });
});

test('updateDetails.toString() returns the proper action type', () => {
    expect(actions.updateDetails.toString()).toBe('CART/UPDATE_DETAILS');
});

test('updateDetails() returns a proper action object', () => {
    expect(actions.updateDetails(payload)).toEqual({
        type: 'CART/UPDATE_DETAILS',
        payload
    });
    expect(actions.updateDetails(error)).toEqual({
        type: 'CART/UPDATE_DETAILS',
        payload: error,
        error: true
    });
});
