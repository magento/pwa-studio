import actions from '../actions';

test('setItems.toString() returns the proper action type', () => {
    expect(actions.setItems.toString()).toBe('PURCHASE_HISTORY/SET_ITEMS');
});

test('setItems() returns a proper action object', () => {
    const payload = { items: [] };
    const error = new Error();

    expect(actions.setItems(payload)).toEqual({
        type: 'PURCHASE_HISTORY/SET_ITEMS',
        payload
    });
    expect(actions.setItems(error)).toEqual({
        type: 'PURCHASE_HISTORY/SET_ITEMS',
        payload: error,
        error: true
    });
});

test('reset.toString() returns the proper action type', () => {
    expect(actions.reset.toString()).toBe('PURCHASE_HISTORY/RESET');
});

test('reset() returns a proper action object', () => {
    expect(actions.reset()).toEqual({
        type: 'PURCHASE_HISTORY/RESET',
        payload: undefined
    });
});

test('fetchPurchaseHistoryRequest.toString() returns the proper action type', () => {
    expect(actions.fetchPurchaseHistoryRequest.toString()).toBe(
        'PURCHASE_HISTORY/FETCH_PURCHASE_HISTORY_REQUEST'
    );
});

test('fetchPurchaseHistoryRequest() returns a proper action object', () => {
    expect(actions.fetchPurchaseHistoryRequest()).toEqual({
        type: 'PURCHASE_HISTORY/FETCH_PURCHASE_HISTORY_REQUEST',
        payload: undefined
    });
});
