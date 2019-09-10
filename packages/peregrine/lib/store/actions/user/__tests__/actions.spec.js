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

test('createAccount.request.toString() returns the proper action type', () => {
    expect(actions.createAccount.request.toString()).toBe(
        'USER/CREATE_ACCOUNT/REQUEST'
    );
});

test('createAccount.request() returns a proper action object', () => {
    expect(actions.createAccount.request(payload)).toEqual({
        type: 'USER/CREATE_ACCOUNT/REQUEST',
        payload
    });
});

test('createAccount.receive.toString() returns the proper action type', () => {
    expect(actions.createAccount.receive.toString()).toBe(
        'USER/CREATE_ACCOUNT/RECEIVE'
    );
});

test('createAccount.receive() returns a proper action object', () => {
    expect(actions.createAccount.receive(payload)).toEqual({
        type: 'USER/CREATE_ACCOUNT/RECEIVE',
        payload
    });
    expect(actions.createAccount.receive(error)).toEqual({
        type: 'USER/CREATE_ACCOUNT/RECEIVE',
        payload: error,
        error: true
    });
});

describe('resetPassword', () => {
    test('resetPassword.request.toString() returns the proper action type', () => {
        expect(actions.resetPassword.request.toString()).toBe(
            'USER/RESET_PASSWORD/REQUEST'
        );
    });

    test('resetPassword.request() returns a proper action object', () => {
        expect(actions.resetPassword.request(payload)).toEqual({
            type: 'USER/RESET_PASSWORD/REQUEST',
            payload
        });
    });

    test('resetPassword.receive.toString() returns the proper action type', () => {
        expect(actions.resetPassword.receive.toString()).toBe(
            'USER/RESET_PASSWORD/RECEIVE'
        );
    });

    test('resetPassword.receive() returns a proper action object', () => {
        expect(actions.resetPassword.receive(payload)).toEqual({
            type: 'USER/RESET_PASSWORD/RECEIVE',
            payload
        });
        expect(actions.resetPassword.receive(error)).toEqual({
            type: 'USER/RESET_PASSWORD/RECEIVE',
            payload: error,
            error: true
        });
    });
});
