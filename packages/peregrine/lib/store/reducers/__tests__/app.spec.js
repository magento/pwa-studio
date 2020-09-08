import reducer from '../app';

const state = {
    drawer: null,
    hasBeenOffline: false,
    isOnline: true,
    overlay: false,
    pending: {},
    query: ''
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
