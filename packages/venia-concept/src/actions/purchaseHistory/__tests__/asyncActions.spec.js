import { getPurchaseHistory } from '../asyncActions';

test('getPurchaseHistory() to return a thunk', () => {
    expect(getPurchaseHistory()).toBeInstanceOf(Function);
});
