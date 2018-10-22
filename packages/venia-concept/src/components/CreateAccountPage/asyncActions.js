import { handleCreateAccount } from '../../actions/user/asyncActions';

export const createAccount = ({ accountInfo, history }) => async dispatch => {
    try {
        await dispatch(handleCreateAccount(accountInfo));

        history.goBack();
    } catch (e) {}
};
