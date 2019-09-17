import actions from '../actions';

const payload = 'FOO';
const error = new Error('BAR');

test('toggleDrawer.toString() returns the proper action type', () => {
    expect(actions.toggleDrawer.toString()).toBe('APP/TOGGLE_DRAWER');
});

test('toggleDrawer() returns a proper action object', () => {
    expect(actions.toggleDrawer(payload)).toEqual({
        type: 'APP/TOGGLE_DRAWER',
        payload
    });
    expect(actions.toggleDrawer(error)).toEqual({
        type: 'APP/TOGGLE_DRAWER',
        payload: error,
        error: true
    });
});
