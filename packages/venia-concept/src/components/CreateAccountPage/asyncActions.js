import { createAccount } from '../../actions/user/asyncActions';

export const handleCreateAccount = ({ accountInfo, history }) => async dispatch => {
    await dispatch(createAccount(accountInfo));

    /*
     * TODO: discuss adding routing to redux https://github.com/supasate/connected-react-router
     * This will allow to navigate by dispatching actions, there will be no need to pass history to asyncActions
     */
    history.push('/');
};
