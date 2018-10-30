import actions from '../actions';

const payload = {};

test('setOrderInformation.toString() returns the proper action type', () => {
    expect(actions.setOrderInformation.toString()).toBe(
        'CHECKOUT_RECEIPT/SET_ORDER_INFORMATION'
    );
});

test('setOrderInformation() returns a proper action object', () => {
    expect(actions.setOrderInformation(payload)).toEqual({
        type: 'CHECKOUT_RECEIPT/SET_ORDER_INFORMATION',
        payload
    });
});

test('reset.toString() returns the proper action type', () => {
    expect(actions.reset.toString()).toBe('CHECKOUT_RECEIPT/RESET');
});

test('reset() returns a proper action object', () => {
    expect(actions.reset()).toEqual({
        type: 'CHECKOUT_RECEIPT/RESET',
        payload: undefined
    });
});
