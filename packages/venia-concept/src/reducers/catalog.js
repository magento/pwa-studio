import { handleActions } from 'redux-actions';

import actions from 'src/actions/catalog';

export const name = 'catalog';

const initialState = {
    categories: null,
    rootCategoryId: null,
    currentPage: 1,
    pageSize: 6,
    prevPageTotal: null,
    chosenFilterOptions: {}
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
    [actions.setPrevPageTotal.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            prevPageTotal: payload
        };
    },
    [actions.updateChosenFilterOptions]: (
        state,
        { payload: { optionName, optionItems } }
    ) => {
        return optionName
            ? {
                  ...state,
                  chosenFilterOptions: {
                      ...state.chosenFilterOptions,
                      [optionName]: {
                          chosenItems: optionItems
                      }
                  }
              }
            : {
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
