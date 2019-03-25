import actions from '../actions';

const MOCK_PAYLOAD = 'Unit Test Payload';
const ERROR = new Error('Unit Test');

describe('setCurrentPage', () => {
    const PREFIX = 'CATALOG/SET_CURRENT_PAGE';

    describe('REQUEST', () => {
        const EXPECTED_NAME = `${PREFIX}/REQUEST`;

        test('it returns the proper action type', () => {
            expect(actions.setCurrentPage.request.toString()).toBe(
                EXPECTED_NAME
            );
        });

        test('it returns a proper action object', () => {
            expect(actions.setCurrentPage.request(MOCK_PAYLOAD)).toEqual({
                type: EXPECTED_NAME,
                payload: MOCK_PAYLOAD
            });

            expect(actions.setCurrentPage.request(ERROR)).toEqual({
                type: EXPECTED_NAME,
                payload: ERROR,
                error: true
            });
        });
    });

    describe('RECEIVE', () => {
        const EXPECTED_NAME = `${PREFIX}/RECEIVE`;

        test('it returns the proper action type', () => {
            expect(actions.setCurrentPage.receive.toString()).toBe(
                EXPECTED_NAME
            );
        });

        test('it returns a proper action object', () => {
            expect(actions.setCurrentPage.receive(MOCK_PAYLOAD)).toEqual({
                type: EXPECTED_NAME,
                payload: MOCK_PAYLOAD
            });

            expect(actions.setCurrentPage.receive(ERROR)).toEqual({
                type: EXPECTED_NAME,
                payload: ERROR,
                error: true
            });
        });
    });
});

describe('setPrevPageTotal', () => {
    const PREFIX = 'CATALOG/SET_PREV_PAGE_TOTAL';

    describe('REQUEST', () => {
        const EXPECTED_NAME = `${PREFIX}/REQUEST`;

        test('it returns the proper action type', () => {
            expect(actions.setPrevPageTotal.request.toString()).toBe(
                EXPECTED_NAME
            );
        });

        test('it returns a proper action object', () => {
            expect(actions.setPrevPageTotal.request(MOCK_PAYLOAD)).toEqual({
                type: EXPECTED_NAME,
                payload: MOCK_PAYLOAD
            });

            expect(actions.setPrevPageTotal.request(ERROR)).toEqual({
                type: EXPECTED_NAME,
                payload: ERROR,
                error: true
            });
        });
    });

    describe('RECEIVE', () => {
        const EXPECTED_NAME = `${PREFIX}/RECEIVE`;

        test('it returns the proper action type', () => {
            expect(actions.setPrevPageTotal.receive.toString()).toBe(
                EXPECTED_NAME
            );
        });

        test('it returns a proper action object', () => {
            expect(actions.setPrevPageTotal.receive(MOCK_PAYLOAD)).toEqual({
                type: EXPECTED_NAME,
                payload: MOCK_PAYLOAD
            });

            expect(actions.setPrevPageTotal.receive(ERROR)).toEqual({
                type: EXPECTED_NAME,
                payload: ERROR,
                error: true
            });
        });
    });
});
