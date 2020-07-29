import reducer, { initialState } from '../cart';
import actions from '../../actions/cart';
import checkoutActions from '../../actions/checkout';

const state = { ...initialState };

describe('getCart.receive', () => {
    const actionType = actions.getCart.receive;

    test('it sets cartId', () => {
        const action = {
            error: null,
            payload: 1,
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('cartId', '1');
    });

    test('it restores initial state, with error payload, on error', () => {
        const errorPayload = new Error('unit test');
        const action = {
            error: true,
            payload: errorPayload,
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual({
            ...initialState,
            getCartError: errorPayload
        });
    });
});

describe('getDetails.request', () => {
    const actionType = actions.getDetails.request;

    test('it sets the isLoading flag', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isLoading', true);
    });
});

describe('getDetails.receive', () => {
    const actionType = actions.getDetails.receive;

    test('it sets isLoading to false and includes all of payload', () => {
        const action = {
            payload: { unit: 'test', other: 'stuff' },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isLoading', false);
        expect(result).toHaveProperty('unit', 'test');
        expect(result).toHaveProperty('other', 'stuff');
    });

    test('it sets isLoading to false and cartId to null on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isLoading', false);
        expect(result).toHaveProperty('cartId', null);
    });
});

describe('addItem.request', () => {
    const actionType = actions.addItem.request;

    test('it sets isAddingItem to true', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isAddingItem', true);
    });
});

describe('addItem.receive', () => {
    const actionType = actions.addItem.receive;

    test('it sets isAddingItem to false', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isAddingItem', false);
    });
});

describe('updateItem.request', () => {
    const actionType = actions.updateItem.request;

    test('it sets isUpdatingItem to true', () => {
        const action = {
            payload: { unit: 'test', other: 'stuff' },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isUpdatingItem', true);
    });
});

describe('updateItem.receive', () => {
    const actionType = actions.updateItem.receive;

    test('it sets isUpdatingItem to false', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isUpdatingItem', false);
    });

    test('it sets updateItemError on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('updateItemError', action.payload);
    });
});

describe('removeItem.receive', () => {
    const actionType = actions.removeItem.receive;

    test('it returns the state with error on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual({
            ...state,
            removeItemError: action.payload
        });
    });
});

describe('checkoutActions.order.accept', () => {
    const actionType = checkoutActions.order.accept;

    test('it returns the initial state', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual(initialState);
    });
});
