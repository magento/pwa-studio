import { getOrderInformation } from '../selectors';

test('getOrderInformation returns order', () => {
    const order = { id: 1, billing_address: {} };
    const state = {
        checkoutReceipt: {
            order
        }
    };

    expect(getOrderInformation(state)).toEqual(order);
});
