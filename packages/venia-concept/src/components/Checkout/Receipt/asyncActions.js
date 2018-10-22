import qs from 'qs';
import { getAccountInformation } from './selectors';
import { resetCheckout } from 'src/actions/checkout/asyncActions';

export const handleCreateAccount = history => async (dispatch, getState) => {
    const accountInfo = getAccountInformation(getState());

    await dispatch(resetCheckout());

    history.push(`/create-account?${qs.stringify(accountInfo)}`);
};
