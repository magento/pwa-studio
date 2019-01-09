import {
    isPurchaseHistoryFetching,
    getPurchaseHistoryItems
} from '../purchaseHistory';

test('getPurchaseHistoryItems returns isFetching state', () => {
    const state = {
        purchaseHistory: {
            items: []
        }
    };
    expect(getPurchaseHistoryItems(state)).toEqual([]);
});

test('isPurchaseHistoryFetching returns isFetching state', () => {
    const state = {
        purchaseHistory: {
            isFetching: true
        }
    };
    expect(isPurchaseHistoryFetching(state)).toEqual(true);
});
