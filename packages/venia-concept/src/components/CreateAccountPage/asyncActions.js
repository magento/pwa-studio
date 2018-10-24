import { handleCreateAccount } from '../../actions/user/asyncActions';

export const createAccount = ({ accountInfo, history }) => async dispatch => {
    /*
     * Server validation error is handled in handleCreateAccount.
     * We set createAccountError in Redux and throw error again
     * to notify redux-thunk action which dispatched handleCreateAccount action.
     */
    try {
        await dispatch(handleCreateAccount(accountInfo));

        history.goBack();
    } catch (e) {}
};
