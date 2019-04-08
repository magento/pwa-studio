import actions from '../actions';

const PREFIX = 'PURCHASE_HISTORY';

describe('getPurchaseHistory', () => {
    const NAME = `${PREFIX}/GET_PURCHASE_HISTORY`;

    describe('request', () => {
        const REQUEST_NAME = `${NAME}/REQUEST`;

        test('toString() returns the proper action type', () => {
            expect(actions.getPurchaseHistory.request.toString()).toBe(
                REQUEST_NAME
            );
        });

        test('it returns a proper action object', () => {
            const payload = { items: [] };
            const error = new Error();

            expect(actions.getPurchaseHistory.request(payload)).toEqual({
                type: REQUEST_NAME,
                payload
            });
            expect(actions.getPurchaseHistory.request(error)).toEqual({
                type: REQUEST_NAME,
                payload: error,
                error: true
            });
        });
    });

    describe('receive', () => {
        const RECEIVE_NAME = `${NAME}/RECEIVE`;

        test('toString() returns the proper action type', () => {
            expect(actions.getPurchaseHistory.receive.toString()).toBe(
                RECEIVE_NAME
            );
        });

        test('it returns a proper action object', () => {
            const payload = { items: [] };
            const error = new Error();

            expect(actions.getPurchaseHistory.receive(payload)).toEqual({
                type: RECEIVE_NAME,
                payload
            });
            expect(actions.getPurchaseHistory.receive(error)).toEqual({
                type: RECEIVE_NAME,
                payload: error,
                error: true
            });
        });
    });
});

describe('reset', () => {
    const NAME = `${PREFIX}/RESET`;

    test('toString() returns the proper action type', () => {
        expect(actions.reset.toString()).toBe(NAME);
    });

    test('it returns a proper action object', () => {
        const payload = 'payload';
        const error = new Error('error');

        expect(actions.reset(payload)).toEqual({
            type: NAME,
            payload
        });
        expect(actions.reset(error)).toEqual({
            type: NAME,
            payload: error,
            error: true
        });
    });
});
