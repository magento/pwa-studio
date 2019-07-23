import actions from './actions';
import mockData from './mockData';
import { preserveQueryParams } from 'src/util/preserveQueryParams';
import { persistentQueries } from 'src/shared/persistentQueries';

export const serialize = (params, keys = [], isArray = false) => {
    const serialized = Object.keys(params)
        .map(key => {
            const val = params[key];
            const isObject =
                Object.prototype.toString.call(val) === '[object Object]';
            if (isObject || Array.isArray(val)) {
                if (val.length === 0) return null;
                keys.push(Array.isArray(params) ? '' : key);
                return serialize(val, keys, Array.isArray(val));
            } else {
                let tKey = key;

                if (keys.length > 0) {
                    const tKeys = isArray
                        ? keys.filter(v => v != '')
                        : [...keys, key].filter(v => v != '');
                    tKey = tKeys.reduce((str, k) => {
                        return '' === str ? k : `${str}[${k}]`;
                    }, '');
                }

                return isArray ? `${tKey}[]=${val}` : `${tKey}=${val}`;
            }
        })
        .filter(Boolean)
        .join('&');

    keys.pop();
    return serialized;
};

const updateCatalogUrl = (filters, history, queryParams) => {
    history.push('?' + queryParams.toString() + '&' + serialize(filters));
};

export const addFilter = ({ group, title, value }, history) =>
    async function thunk(dispatch, getState) {
        const {
            catalog: { chosenFilterOptions }
        } = getState();

        const oldState = chosenFilterOptions[group] || [];
        const newState = oldState.concat({ title, value });

        dispatch(actions.filterOption.update({ newState, group }));

        if (history) {
            const filters = { ...chosenFilterOptions, [group]: newState };
            updateCatalogUrl(filters, history);
        }
    };

export const removeFilter = ({ group, title, value }, history, location) =>
    async function thunk(dispatch, getState) {
        const {
            catalog: { chosenFilterOptions }
        } = getState();
        const newQueryParam = preserveQueryParams(location, persistentQueries);

        const oldState = chosenFilterOptions[group] || [];
        const newState = oldState.filter(item => {
            return item.title !== title || item.value !== value;
        });

        dispatch(actions.filterOption.update({ newState, group }));

        if (history) {
            const filters = { ...chosenFilterOptions, [group]: newState };
            updateCatalogUrl(filters, history, newQueryParam);
        }
    };

export const getAllCategories = () =>
    async function thunk(dispatch) {
        dispatch(actions.getAllCategories.request());

        try {
            // TODO: implement rest or graphql call for categories
            // `/rest/V1/categories` requires auth for some reason
            // TODO: we need to configure Jest to support dynamic imports
            // const { default: payload } = await import('./mockData');

            dispatch(actions.getAllCategories.receive(mockData));
        } catch (error) {
            dispatch(actions.getAllCategories.receive(error));
        }
    };

export const setCurrentPage = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentPage.receive(payload));
    };

export const setPrevPageTotal = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setPrevPageTotal.receive(payload));
    };
