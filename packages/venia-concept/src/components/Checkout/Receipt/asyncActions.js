import { resetCheckout } from 'src/actions/checkout/asyncActions';
import { objectToQueryString } from 'src/util/queryStringHelpers';
import { getAccountInformation } from './selectors';

export const handleCreateAccount = history => async (dispatch, getState) => {
    const accountInfo = getAccountInformation(getState());

    await dispatch(resetCheckout());

    history.push(`/create-account${objectToQueryString(accountInfo)}`);
};
