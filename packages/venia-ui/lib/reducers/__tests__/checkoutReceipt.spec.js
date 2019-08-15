import actions from '../../actions/checkoutReceipt';
import reducer from '../checkoutReceipt';

const order = { id: 1, billing_address: {} };

test('reducer returns initial state', () => {
    expect(reducer(undefined, {})).toEqual({ order: {} });
});

test('reducer saves order information', () => {
    expect(reducer({ order: {} }, actions.setOrderInformation(order))).toEqual({
        order
    });
});
