import { handleActions } from 'redux-actions';

import actions from 'src/actions/catalog';

export const name = 'catalog';

export const initialState = {
    categories: null,
    rootCategoryId: null,
    currentPage: 1,
    pageSize: 6,
    chosenFilterOptions: {},
    appliedFilterOptions: {}
};

const reducerMap = {
    [actions.getAllCategories.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            categories: getNormalizedCategories(payload),
            rootCategoryId: payload.id
        };
    },
    [actions.setCurrentPage.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            currentPage: payload
        };
    },
    [actions.filterOption.add]: (state, { payload: { newState, group } }) => {
        return {
            ...state,
            chosenFilterOptions: {
                ...state.chosenFilterOptions,
                [group]: newState
            }
        };
    },
    [actions.filterOption.remove]: (
        state,
        { payload: { newState, group } }
    ) => {
        return {
            ...state,
            chosenFilterOptions: {
                ...state.chosenFilterOptions,
                [group]: newState
            }
        };
    },
    [actions.filterOption.clear]: state => {
        return {
            ...state,
            chosenFilterOptions: {}
        };
    }
};

export default handleActions(reducerMap, initialState);

/* helpers */

function* extractChildCategories(category) {
    const { childrenData } = category;

    for (const child of childrenData) {
        yield* extractChildCategories(child);
    }

    category.childrenData = childrenData.map(({ id }) => id);

    yield category;
}

function getNormalizedCategories(rootCategory) {
    const map = {};

    for (const category of extractChildCategories(rootCategory)) {
        map[category.id] = category;
    }

    return map;
}
