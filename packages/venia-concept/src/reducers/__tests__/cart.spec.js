import cartReducers, { initialState } from 'src/reducers/cart';
import actions from 'src/actions/cart';
import checkoutActions from 'src/actions/checkout';

test('getGuestCart.receive: adds guestCartId to state', () => {
    expect(
        cartReducers(
            { other: 'stuff' },
            { type: actions.getGuestCart.receive, payload: 'A_CART' }
        )
    ).toEqual({
        other: 'stuff',
        guestCartId: 'A_CART'
    });
});

test('getGuestCart.receive: restores initial state on error', () => {
    expect(
        cartReducers(
            { guestCartId: 'AN_EXPIRED_CART', other: 'stuff' },
            {
                type: actions.getGuestCart.receive,
                payload: new Error('Failed to get a guest cart!'),
                error: true
            }
        )
    ).toEqual(initialState);
});

test('getGuestCart.receive: adds guestCartId to state', () => {
    expect(
        cartReducers(
            { other: 'stuff' },
            { type: actions.getGuestCart.receive, payload: 'A_CART' }
        )
    ).toEqual({
        other: 'stuff',
        guestCartId: 'A_CART'
    });
});

test('getDetails.receive: merges payload with state', () => {
    expect(
        cartReducers(
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
        other: 'stuff',
        totals: {
            total: 200
        },
        details: {
            items: ['woah']
        }
    });
});

test('getDetails.receive: removes guestCartId on error', () => {
    const state = { guestCartId: 123, other: 'stuff', totals: { total: 100 } };
    const nextState = cartReducers(state, {
        type: actions.getDetails.receive,
        payload: new Error('That did not work at all'),
        error: true
    });
    expect(nextState).toMatchObject({ other: 'stuff', totals: { total: 100 } });
    expect(nextState.guestCartId).not.toBeTruthy();
});

test('checkoutActions.order.accept: cart resets to initial state', () => {
    expect(
        cartReducers(
            { guestCartId: 'SOME_CART', details: { items: ['done'] } },
            { type: checkoutActions.order.accept }
        )
    ).toEqual(initialState);
});
