import reducer from '../app';

const state = {
    drawer: null,
    hasBeenOffline: false,
    isOnline: true,
    overlay: false,
    pending: {},
    query: '',
    searchOpen: false
};

test('toggleDrawer sets the overlay flag and the drawer to the action payload', () => {
    const action = {
        payload: 'cart',
        type: 'APP/TOGGLE_DRAWER'
    };

    const result = reducer(state, action);

    expect(result).toHaveProperty('drawer', action.payload);
    expect(result).toHaveProperty('overlay', true);
});

describe('toggleSearch', () => {
    test('toggleSearch flips the searchOpen flag to true', () => {
        const action = {
            type: 'APP/TOGGLE_SEARCH'
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('searchOpen', true);
    });

    test('toggleSearch flips the searchOpen flag to false', () => {
        const action = {
            type: 'APP/TOGGLE_SEARCH'
        };

        const testState = {
            ...state,
            searchOpen: true
        };

        const result = reducer(testState, action);

        expect(result).toHaveProperty('searchOpen', false);
    });
});

test('executeSearch sets the query to the action payload', () => {
    const action = {
        payload: 'unit test',
        type: 'APP/EXECUTE_SEARCH'
    };

    const result = reducer(state, action);

    expect(result).toHaveProperty('query', 'unit test');
});

test('setOnline sets the isOnline flag to true', () => {
    const action = {
        type: 'APP/SET_ONLINE'
    };

    const result = reducer(state, action);

    expect(result).toHaveProperty('isOnline', true);
});

test('setOffline sets the isOnline and hasBeenOffline flags appropriately', () => {
    const action = {
        type: 'APP/SET_OFFLINE'
    };

    const result = reducer(state, action);

    expect(result).toHaveProperty('isOnline', false);
    expect(result).toHaveProperty('hasBeenOffline', true);
});
