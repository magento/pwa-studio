import { Magento2 } from '../../../RestApi';
import actions from './actions';

const { request } = Magento2;

export const getCountries = () =>
    async function thunk(dispatch, getState) {
        const { directory } = getState();

        if (directory && directory.countries) {
            return;
        }

        try {
            const response = await request('/rest/V1/directory/countries');

            dispatch(actions.getCountries(response));
        } catch (error) {
            dispatch(actions.getCountries(error));
        }
    };
