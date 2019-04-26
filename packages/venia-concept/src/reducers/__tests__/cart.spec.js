import reducer, { initialState } from 'src/reducers/cart';
import actions from 'src/actions/cart';
import checkoutActions from 'src/actions/checkout';

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

    test('it restores initial state on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual(initialState);
    });
});

describe('getDetails.request', () => {
    const actionType = actions.getDetails.request;

    test('it sets cartId and the isLoading flag', () => {
        const action = {
            payload: 1,
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('cartId', '1');
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

    test('it sets isUpdatingItem to true and includes all of payload', () => {
        const action = {
            payload: { unit: 'test', other: 'stuff' },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isUpdatingItem', true);
        expect(result).toHaveProperty('unit', 'test');
        expect(result).toHaveProperty('other', 'stuff');
    });

    test('it returns the initial state on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual(initialState);
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
});

describe('removeItem.receive', () => {
    const actionType = actions.removeItem.receive;

    test('it includes all of payload on success', () => {
        const action = {
            payload: { unit: 'test', cartItemCount: 5 },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('unit', 'test');
        expect(result).toHaveProperty('cartItemCount', 5);
    });

    test('it returns the initial state if there is only one item', () => {
        const action = {
            payload: { unit: 'test', cartItemCount: 1 },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual(initialState);
    });

    test('it returns the initial state on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual({
            ...initialState,
            removeItemError: action.payload
        });
    });
});

describe('openOptionsDrawer', () => {
    const actionType = actions.openOptionsDrawer;

    test('it sets isOptionsDrawerOpen to true', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isOptionsDrawerOpen', true);
    });
});

describe('closeOptionsDrawer', () => {
    const actionType = actions.closeOptionsDrawer;

    test('it sets isOptionsDrawerOpen to false', () => {
        const action = {
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('isOptionsDrawerOpen', false);
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
