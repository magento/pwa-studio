import reducer, { initialState } from '../catalog';
import actions from '../../actions/catalog';

const state = { ...initialState };

describe('setCurrentPage.receive', () => {
    const actionType = actions.setCurrentPage.receive;

    test('it sets currentPage to payload', () => {
        const action = {
            payload: 7,
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('currentPage', 7);
    });

    test('it does not alter state on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual(state);
    });
});

describe('setPrevPageTotal.receive', () => {
    const actionType = actions.setPrevPageTotal.receive;

    test('it sets prevPageTotal to payload', () => {
        const action = {
            payload: 5,
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('prevPageTotal', 5);
    });

    test('it does not alter state on error', () => {
        const action = {
            error: true,
            payload: new Error('unit test'),
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toEqual(state);
    });
});
