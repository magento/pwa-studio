import actions from '../actions';

test('purchaseDetails.request.toString() returns the proper action type', () => {
    expect(actions.request.toString()).toBe('PURCHASE_DETAILS/REQUEST');
});

test('purchaseDetails.request() returns a proper action object', () => {
    const orderId = 1;
    expect(actions.request({ orderId })).toEqual({
        type: 'PURCHASE_DETAILS/REQUEST',
        payload: { orderId }
    });
});

test('purchaseDetails.receive.toString() returns the proper action type', () => {
    expect(actions.receive.toString()).toBe('PURCHASE_DETAILS/RECEIVE');
});

test('purchaseDetails.receive() returns a proper action object', () => {
    const order = {};
    expect(actions.receive({ order })).toEqual({
        type: 'PURCHASE_DETAILS/RECEIVE',
        payload: { order }
    });
});
