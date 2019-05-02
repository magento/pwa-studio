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

test('createAccountError.request.toString() returns the proper action type', () => {
    expect(actions.createAccountError.request.toString()).toBe(
        'USER/CREATE_ACCOUNT_ERROR/REQUEST'
    );
});

test('createAccountError.request() returns a proper action object', () => {
    expect(actions.createAccountError.request(payload)).toEqual({
        type: 'USER/CREATE_ACCOUNT_ERROR/REQUEST',
        payload
    });
});

test('createAccountError.receive.toString() returns the proper action type', () => {
    expect(actions.createAccountError.receive.toString()).toBe(
        'USER/CREATE_ACCOUNT_ERROR/RECEIVE'
    );
});

test('createAccountError.receive() returns a proper action object', () => {
    expect(actions.createAccountError.receive(payload)).toEqual({
        type: 'USER/CREATE_ACCOUNT_ERROR/RECEIVE',
        payload
    });
    expect(actions.createAccountError.receive(error)).toEqual({
        type: 'USER/CREATE_ACCOUNT_ERROR/RECEIVE',
        payload: error,
        error: true
    });
});

test('resetCreateAccountError.request.toString() returns the proper action type', () => {
    expect(actions.resetCreateAccountError.request.toString()).toBe(
        'USER/RESET_CREATE_ACCOUNT_ERROR/REQUEST'
    );
});

test('resetCreateAccountError.request() returns a proper action object', () => {
    expect(actions.resetCreateAccountError.request(payload)).toEqual({
        type: 'USER/RESET_CREATE_ACCOUNT_ERROR/REQUEST',
        payload
    });
});

test('resetCreateAccountError.receive.toString() returns the proper action type', () => {
    expect(actions.resetCreateAccountError.receive.toString()).toBe(
        'USER/RESET_CREATE_ACCOUNT_ERROR/RECEIVE'
    );
});

test('resetCreateAccountError.receive() returns a proper action object', () => {
    expect(actions.resetCreateAccountError.receive(payload)).toEqual({
        type: 'USER/RESET_CREATE_ACCOUNT_ERROR/RECEIVE',
        payload
    });
    expect(actions.resetCreateAccountError.receive(error)).toEqual({
        type: 'USER/RESET_CREATE_ACCOUNT_ERROR/RECEIVE',
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

describe('completePasswordReset', () => {
    test('completePasswordReset.toString() returns the proper action type', () => {
        expect(actions.completePasswordReset.toString()).toBe(
            'USER/COMPLETE_PASSWORD_RESET'
        );
    });

    test('completePasswordReset() returns a proper action object', () => {
        expect(actions.completePasswordReset(payload)).toEqual({
            type: 'USER/COMPLETE_PASSWORD_RESET',
            payload
        });
        expect(actions.completePasswordReset(error)).toEqual({
            type: 'USER/COMPLETE_PASSWORD_RESET',
            payload: error,
            error: true
        });
    });
});
