import actions from '../actions';
import reducer from '../reducer';

const order = { id: 1, billing_address: {} };

test('reducer returns initial state', () => {
    expect(reducer(undefined, {})).toEqual({ order: {} });
});

test('reducer saves order information', () => {
    expect(reducer({ order: {} }, actions.setOrderInformation(order))).toEqual({
        order
    });
});
