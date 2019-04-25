import actions from '../actions';

const payload = 'PAYLOAD';
const error = new Error('ERROR');

test('addItem.request.toString() returns the proper action type', () => {
    expect(actions.addItem.request.toString()).toBe('CART/ADD_ITEM/REQUEST');
});

test('addItem.request() returns a proper action object', () => {
    expect(actions.addItem.request(payload)).toEqual({
        type: 'CART/ADD_ITEM/REQUEST',
        payload
    });
});

test('addItem.receive.toString() returns the proper action type', () => {
    expect(actions.addItem.receive.toString()).toBe('CART/ADD_ITEM/RECEIVE');
});

test('addItem.receive() returns a proper action object', () => {
    expect(actions.addItem.receive(payload)).toEqual({
        type: 'CART/ADD_ITEM/RECEIVE',
        payload
    });
    expect(actions.addItem.receive(error)).toEqual({
        type: 'CART/ADD_ITEM/RECEIVE',
        payload: error,
        error: true
    });
});

test('removeItem.request.toString() returns the proper action type', () => {
    expect(actions.removeItem.request.toString()).toBe(
        'CART/REMOVE_ITEM/REQUEST'
    );
});

test('removeItem.request() returns a proper action object', () => {
    expect(actions.removeItem.request(payload)).toEqual({
        type: 'CART/REMOVE_ITEM/REQUEST',
        payload
    });
});

test('removeItem.receive.toString() returns the proper action type', () => {
    expect(actions.removeItem.receive.toString()).toBe(
        'CART/REMOVE_ITEM/RECEIVE'
    );
});

test('removeItem.receive() returns a proper action object', () => {
    expect(actions.removeItem.receive(payload)).toEqual({
        type: 'CART/REMOVE_ITEM/RECEIVE',
        payload
    });
    expect(actions.removeItem.receive(error)).toEqual({
        type: 'CART/REMOVE_ITEM/RECEIVE',
        payload: error,
        error: true
    });
});

test('getCart.request.toString() returns the proper action type', () => {
    expect(actions.getCart.request.toString()).toBe('CART/GET_CART/REQUEST');
});

test('getCart.request() returns a proper action object', () => {
    expect(actions.getCart.request(payload)).toEqual({
        type: 'CART/GET_CART/REQUEST',
        payload
    });
});

test('getCart.receive.toString() returns the proper action type', () => {
    expect(actions.getCart.receive.toString()).toBe('CART/GET_CART/RECEIVE');
});

test('getCart.receive() returns a proper action object', () => {
    expect(actions.getCart.receive(payload)).toEqual({
        type: 'CART/GET_CART/RECEIVE',
        payload
    });
    expect(actions.getCart.receive(error)).toEqual({
        type: 'CART/GET_CART/RECEIVE',
        payload: error,
        error: true
    });
});

test('getDetails.request.toString() returns the proper action type', () => {
    expect(actions.getDetails.request.toString()).toBe(
        'CART/GET_DETAILS/REQUEST'
    );
});

test('getDetails.request() returns a proper action object', () => {
    expect(actions.getDetails.request(payload)).toEqual({
        type: 'CART/GET_DETAILS/REQUEST',
        payload
    });
});

test('getDetails.receive.toString() returns the proper action type', () => {
    expect(actions.getDetails.receive.toString()).toBe(
        'CART/GET_DETAILS/RECEIVE'
    );
});

test('getDetails.receive() returns a proper action object', () => {
    expect(actions.getDetails.receive(payload)).toEqual({
        type: 'CART/GET_DETAILS/RECEIVE',
        payload
    });
    expect(actions.getDetails.receive(error)).toEqual({
        type: 'CART/GET_DETAILS/RECEIVE',
        payload: error,
        error: true
    });
});

test('updateItem.request.toString() returns the proper action type', () => {
    expect(actions.updateItem.request.toString()).toBe(
        'CART/UPDATE_ITEM/REQUEST'
    );
});

test('updateItem.request() returns a proper action object', () => {
    expect(actions.updateItem.request(payload)).toEqual({
        type: 'CART/UPDATE_ITEM/REQUEST',
        payload
    });
});

test('updateItem.receive.toString() returns the proper action type', () => {
    expect(actions.updateItem.receive.toString()).toBe(
        'CART/UPDATE_ITEM/RECEIVE'
    );
});

test('updateItem.receive() returns a proper action object', () => {
    expect(actions.updateItem.receive(payload)).toEqual({
        type: 'CART/UPDATE_ITEM/RECEIVE',
        payload
    });
    expect(actions.updateItem.receive(error)).toEqual({
        type: 'CART/UPDATE_ITEM/RECEIVE',
        payload: error,
        error: true
    });
});

test('openOptionsDrawer.toString() returns the proper action type', () => {
    expect(actions.openOptionsDrawer.toString()).toBe(
        'CART/OPEN_OPTIONS_DRAWER'
    );
});

test('openOptionsDrawer() returns a proper action object', () => {
    expect(actions.openOptionsDrawer(payload)).toEqual({
        type: 'CART/OPEN_OPTIONS_DRAWER',
        payload
    });
});

test('closeOptionsDrawer.toString() returns the proper action type', () => {
    expect(actions.closeOptionsDrawer.toString()).toBe(
        'CART/CLOSE_OPTIONS_DRAWER'
    );
});

test('closeOptionsDrawer() returns a proper action object', () => {
    expect(actions.closeOptionsDrawer(payload)).toEqual({
        type: 'CART/CLOSE_OPTIONS_DRAWER',
        payload
    });
});
