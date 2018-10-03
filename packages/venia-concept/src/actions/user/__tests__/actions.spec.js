import actions from '../actions';

const payload = 'PAYLOAD';
const error = new Error('ERROR');

test('signIn.request.toString() returns the proper action type', () => {
    expect(actions.signIn.request.toString()).toBe('USER/SIGN_IN/REQUEST');
});

test('signIn.request() returns a proper action object', () => {
    expect(actions.signIn.request(payload)).toEqual({
        type: 'USER/SIGN_IN/REQUEST',
        payload
    });
});

test('signIn.receive.toString() returns the proper action type', () => {
    expect(actions.signIn.receive.toString()).toBe('USER/SIGN_IN/RECEIVE');
});

test('signIn.receive() returns a proper action object', () => {
    expect(actions.signIn.receive(payload)).toEqual({
        type: 'USER/SIGN_IN/RECEIVE',
        payload
    });
    expect(actions.signIn.receive(error)).toEqual({
        type: 'USER/SIGN_IN/RECEIVE',
        payload: error,
        error: true
    });
});

test('resetSignInError.request.toString() returns the proper action type', () => {
    expect(actions.resetSignInError.request.toString()).toBe(
        'USER/RESET_SIGN_IN_ERROR/REQUEST'
    );
});

test('resetSignInError.request() returns a proper action object', () => {
    expect(actions.resetSignInError.request(payload)).toEqual({
        type: 'USER/RESET_SIGN_IN_ERROR/REQUEST',
        payload
    });
});

test('resetSignInError.receive.toString() returns the proper action type', () => {
    expect(actions.resetSignInError.receive.toString()).toBe(
        'USER/RESET_SIGN_IN_ERROR/RECEIVE'
    );
});

test('resetSignInError.receive() returns a proper action object', () => {
    expect(actions.resetSignInError.receive(payload)).toEqual({
        type: 'USER/RESET_SIGN_IN_ERROR/RECEIVE',
        payload
    });
    expect(actions.resetSignInError.receive(error)).toEqual({
        type: 'USER/RESET_SIGN_IN_ERROR/RECEIVE',
        payload: error,
        error: true
    });
});
