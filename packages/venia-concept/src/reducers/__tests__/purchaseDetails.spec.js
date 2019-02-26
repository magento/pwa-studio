import purchaseDetailsReducer from '../purchaseDetails';
import actions from 'src/actions/purchaseDetails';

test('purchaseDetails.request: toggle isFetching to true', () => {
    expect(
        purchaseDetailsReducer({ isFetching: false }, { type: actions.request })
    ).toEqual({ isFetching: true });
});
