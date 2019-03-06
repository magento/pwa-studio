import purchaseHistoryReducer from '../purchaseHistory';
import actions from 'src/actions/purchaseHistory';

const mockInitialState = { items: [], isFetching: false };

describe('getPurchaseHistory', () => {
    describe('request', () => {
        test('it sets isFetching to true', () => {
            const result = purchaseHistoryReducer(mockInitialState, {
                type: actions.getPurchaseHistory.request,
                payload: undefined
            });

            expect(result).toEqual({
                isFetching: true,
                items: mockInitialState.items
            });
        });
    });

    describe('receive', () => {
        test('it sets items and isFetching to false on success', () => {
            const payload = {
                items: [{ unit: 'test' }]
            };

            const result = purchaseHistoryReducer(mockInitialState, {
                type: actions.getPurchaseHistory.receive,
                payload
            });

            expect(result).toEqual({
                isFetching: false,
                items: payload.items
            });
        });

        test('it doesnt change items and sets isFetching to false on failure', () => {
            const result = purchaseHistoryReducer(mockInitialState, {
                type: actions.getPurchaseHistory.receive,
                payload: new Error(),
                error: true
            });

            expect(result).toEqual({
                isFetching: false,
                items: mockInitialState.items
            });
        });
    });
});

describe('reset', () => {
    test('it restores initial value', () => {
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
});
