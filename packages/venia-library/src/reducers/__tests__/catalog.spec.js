import reducer, { initialState } from '../catalog';
import actions from 'src/actions/catalog';

const state = { ...initialState };

describe('getAllCategories.receive', () => {
    const actionType = actions.getAllCategories.receive;

    test('it sets categories and rootCategoryId', () => {
        const action = {
            payload: {
                childrenData: [],
                id: 9
            },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('rootCategoryId', 9);
        expect(result).toHaveProperty('categories', expect.any(Object));
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

    test('it normalizes the categories', () => {
        const action = {
            payload: {
                childrenData: [
                    { id: 1, childrenData: [] },
                    { id: 2, childrenData: [] },
                    {
                        id: 3,
                        childrenData: [
                            { id: 4, childrenData: [] },
                            { id: 5, childrenData: [] }
                        ]
                    }
                ],
                id: 9
            },
            type: actionType
        };

        const result = reducer(state, action);

        expect(result).toHaveProperty('categories', {
            1: {
                childrenData: [],
                id: 1
            },
            2: {
                childrenData: [],
                id: 2
            },
            3: {
                childrenData: [4, 5],
                id: 3
            },
            4: {
                childrenData: [],
                id: 4
            },
            5: {
                childrenData: [],
                id: 5
            },
            9: {
                childrenData: [1, 2, 3],
                id: 9
            }
        });
    });
});

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
