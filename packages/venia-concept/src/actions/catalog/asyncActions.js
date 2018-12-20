import actions from './actions';
import mockData from './mockData';

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
        window.scrollTo(0, 0);
    };

export const setPrevPageTotal = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setPrevPageTotal.receive(payload));
    };
