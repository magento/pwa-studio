import { RestApi } from '@magento/peregrine';

import actions from './actions';

const { request } = RestApi.Magento2;

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
