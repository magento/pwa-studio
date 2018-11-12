import { handleActions } from 'redux-actions';

import actions from 'src/actions/catalog';

export const name = 'catalog';

const initialState = {
    categories: null,
    rootCategoryId: null
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
