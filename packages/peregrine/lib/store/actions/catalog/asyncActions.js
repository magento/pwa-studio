import actions from './actions';

export const setCurrentPage = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentPage.receive(payload));
    };

export const setPrevPageTotal = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setPrevPageTotal.receive(payload));
    };
