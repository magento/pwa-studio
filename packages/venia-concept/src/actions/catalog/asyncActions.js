import actions from './actions';

export const getAllCategories = () =>
    async function thunk(dispatch) {
        dispatch(actions.getAllCategories.request());

        try {
            // TODO: implement rest or graphql call for categories
            // `/rest/V1/categories` requires auth for some reason
            const { default: payload } = await import('./mockData');

            dispatch(actions.getAllCategories.receive(payload));
        } catch (error) {
            dispatch(actions.getAllCategories.receive(error));
        }
    };
