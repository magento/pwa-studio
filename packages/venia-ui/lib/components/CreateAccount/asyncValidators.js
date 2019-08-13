import { RestApi } from '@magento/peregrine';

const { request } = RestApi.Magento2;

export const validateEmail = async value => {
    try {
        const body = {
            customerEmail: value,
            website_id: null
        };

        // response is a boolean
        const available = await request('/rest/V1/customers/isEmailAvailable', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        return !available ? 'This email address is not available.' : null;
    } catch (error) {
        throw 'An error occurred while looking up this email address.';
    }
};
