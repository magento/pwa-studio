import { createActions } from 'redux-actions';
import { RestApi } from '@magento/peregrine';

const prefix = 'DIRECTORY';
const actionTypes = ['GET_COUNTRIES'];

const actions = createActions(...actionTypes, { prefix });
export default actions;

/* async action creators */

const { request } = RestApi.Magento2;

export const getCountries = () =>
    async function thunk(dispatch, getState) {
        const { directory } = getState();

        if (directory.countries) {
            return;
        }

        try {
            const response = await request('/rest/V1/directory/countries');

            dispatch(actions.getCountries(response));
        } catch (error) {
            dispatch(actions.getCountries(error));
        }
    };
