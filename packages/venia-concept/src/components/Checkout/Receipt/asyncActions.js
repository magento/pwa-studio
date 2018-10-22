import { getAccountInformation } from './selectors';
import { closeDrawer } from 'src/actions/app/asyncActions';

export const handleCreateAccount = history => (dispatch, getState) => {
    const accountInfo = getAccountInformation(getState());

    dispatch(closeDrawer());

    history.push('/create-account');
};
