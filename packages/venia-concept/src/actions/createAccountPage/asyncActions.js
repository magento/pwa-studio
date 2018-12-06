import { createNewUserRequest } from 'src/actions/user';

export const createAccount = ({ accountInfo, history }) => async dispatch => {
    /*
     * Server validation error is handled in handleCreateAccount.
     * We set createAccountError in Redux and throw error again
     * to notify redux-thunk action which dispatched handleCreateAccount action.
     */
    try {
        await dispatch(createNewUserRequest(accountInfo));
        history.push('/');
    } catch (e) {}
};
