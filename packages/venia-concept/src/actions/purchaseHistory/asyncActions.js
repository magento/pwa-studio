import actions from './actions';
import mockData from './mockData';

export const getPurchaseHistory = () =>
    async function thunk(dispatch) {
        dispatch(actions.getPurchaseHistory.request());

        try {
            // TODO: make an actual request here.
            dispatch(actions.getPurchaseHistory.receive(mockData));
        } catch (error) {
            dispatch(actions.getPurchaseHistory.receive(error));
        }
    };
