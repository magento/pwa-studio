import actions from './actions';
import { fetchPurchaseHistory } from './api';

export const getPurchaseHistory = () =>
    async function thunk(dispatch) {
        dispatch(actions.fetchPurchaseHistoryRequest());

        try {
            const response = await fetchPurchaseHistory();

            dispatch(actions.setItems(response));
        } catch (error) {
            dispatch(actions.setItems(error));
        }
    };
