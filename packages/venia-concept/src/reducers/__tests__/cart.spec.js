import reducer, { initialState } from 'src/reducers/cart';
import actions from 'src/actions/cart';
import checkoutActions from 'src/actions/checkout';

test('getCart.receive: adds cartId to state', () => {
    expect(
        reducer(
            { other: 'stuff' },
            { type: actions.getCart.receive, payload: 'A_CART' }
        )
    ).toEqual({
        other: 'stuff',
        cartId: 'A_CART'
    });
});

test('getCart.receive: restores initial state on error', () => {
    expect(
        reducer(
            { cartId: 'AN_EXPIRED_CART', other: 'stuff' },
            {
                type: actions.getCart.receive,
                payload: new Error('Failed to get a guest cart!'),
                error: true
            }
        )
    ).toEqual(initialState);
});

test('getDetails.receive: merges payload with state', () => {
    expect(
        reducer(
            { other: 'stuff', totals: { total: 100 } },
            {
                type: actions.getDetails.receive,
                payload: {
                    totals: { total: 200 },
                    details: { items: ['woah'] }
                }
            }
        )
    ).toEqual({
        loading: false,
        other: 'stuff',
        totals: {
            total: 200
        },
        details: {
            items: ['woah']
        }
    });
});

test('getDetails.receive: removes cartId on error', () => {
    const state = { cartId: 123, other: 'stuff', totals: { total: 100 } };
    const nextState = reducer(state, {
        type: actions.getDetails.receive,
        payload: new Error('That did not work at all'),
        error: true
    });
    expect(nextState).toMatchObject({ other: 'stuff', totals: { total: 100 } });
    expect(nextState.cartId).not.toBeTruthy();
});

test('checkoutActions.order.accept: cart resets to initial state', () => {
    expect(
        reducer(
            { cartId: 'SOME_CART', details: { items: ['done'] } },
            { type: checkoutActions.order.accept }
        )
    ).toEqual(initialState);
});
