import purchaseHistoryReducer from '../purchaseHistory';
import actions from 'src/actions/purchaseHistory';

test('fetchPurchaseHistoryRequest: changes isFetching state', () => {
    expect(
        purchaseHistoryReducer(
            { items: [], isFetching: true },
            { type: actions.fetchPurchaseHistoryRequest, payload: undefined }
        )
    ).toEqual({
        items: [],
        isFetching: true
    });
});

test('setItems: adds items to state', () => {
    const response = { items: [{}, {}] };

    expect(
        purchaseHistoryReducer(
            { items: [], isFetching: true },
            { type: actions.setItems, payload: response }
        )
    ).toEqual({
        items: response.items,
        isFetching: false
    });
});

test('setItems: changes isFetching state on error', () => {
    expect(
        purchaseHistoryReducer(
            { items: [], isFetching: true },
            { type: actions.setItems, payload: new Error(), error: true }
        )
    ).toEqual({
        items: [],
        isFetching: false
    });
});

test('reset: restores initial value', () => {
    expect(
        purchaseHistoryReducer(
            { items: [{}], isFetching: true },
            { type: actions.reset, payload: undefined }
        )
    ).toEqual({
        items: [],
        isFetching: false
    });
});
