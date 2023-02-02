import { handleActions } from 'redux-actions';

import actions from '../actions/catalog';

export const name = 'catalog';

const fromPairs = pairs => {
    const result = {};

    for (const [key, value] of pairs) {
        result[key] = value;
    }

    return result;
};

const initialState = {
    categories: {},
    currentPage: 1,
    pageSize: 6,
    prevPageTotal: null
};

const reducerMap = {
    [actions.updateCategories]: (state, { payload }) => {
        const { uid } = payload;
        const currentCategory = state.categories[uid] || {};

        // if category has already been fetched, do nothing
        if (currentCategory.children) {
            return state;
        }

        // sort children by `position`
        const children = [...payload.children].sort((a, b) => {
            if (a.position > b.position) {
                return 1;
            } else if (a.position === b.position && a.uid > b.uid) {
                return 1;
            } else {
                return -1;
            }
        });

        // use a Map to preserve sort order
        // since a plain object with numeric keys would lose it
        const childMap = new Map();

        // merge children and add them to the Map, keyed by `id`
        for (const child of children) {
            childMap.set(child.uid, {
                ...child,
                ...(state.categories[child.uid] || {}),
                parentId: uid
            });
        }

        // merge in the fetched child last
        return {
            ...state,
            categories: {
                ...state.categories,
                ...fromPairs(childMap),
                [uid]: {
                    ...currentCategory,
                    ...payload,
                    children: [...childMap.keys()],
                    children_count: childMap.size
                }
            }
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
    }
};

export default handleActions(reducerMap, initialState);
