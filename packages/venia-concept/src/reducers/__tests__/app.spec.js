import reducer from '../app';

const baseState = {
    drawer: null,
    hasBeenOffline: false,
    isOnline: true,
    overlay: false,
    pending: {},
    query: '',
    searchOpen: false
};

test('toggleDrawer', () => {
    const action = {
        payload: 'cart',
        type: 'APP/TOGGLE_DRAWER'
    };

    const result = reducer(baseState, action);

    expect(result).toEqual({
        ...baseState,
        drawer: 'cart',
        overlay: true
    });
});

test('toggleSearch', () => {
    const action = {
        type: 'APP/TOGGLE_SEARCH'
    };

    const result = reducer(baseState, action);

    expect(result).toEqual({
        ...baseState,
        searchOpen: true
    });
});

test('executeSearch', () => {
    const action = {
        payload: 'unit test',
        type: 'APP/EXECUTE_SEARCH'
    };

    const result = reducer(baseState, action);

    expect(result).toEqual({
        ...baseState,
        query: 'unit test'
    });
});

test('setOnline', () => {
    const action = {
        type: 'APP/SET_ONLINE'
    };

    const result = reducer(baseState, action);

    expect(result).toEqual({
        ...baseState,
        isOnline: true
    });
});

test('setOffline', () => {
    const action = {
        type: 'APP/SET_OFFLINE'
    };

    const result = reducer(baseState, action);

    expect(result).toEqual({
        ...baseState,
        isOnline: false,
        hasBeenOffline: true
    });
});
