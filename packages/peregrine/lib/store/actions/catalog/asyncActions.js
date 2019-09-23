import actions from './actions';
import { preserveQueryParams } from '../../../util/preserveQueryParams';
import serializeToParam from '../../../util/serializeToParam';

const updateCatalogUrl = (filters, history, queryParams) => {
    history.push(
        '?' + queryParams.toString() + '&' + serializeToParam(filters)
    );
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
        const newQueryParam = preserveQueryParams(location);

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

export const setCurrentPage = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentPage.receive(payload));
    };

export const setPrevPageTotal = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setPrevPageTotal.receive(payload));
    };
