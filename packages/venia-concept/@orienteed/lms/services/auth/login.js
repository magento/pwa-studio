import { Magento2 } from '@magento/peregrine/lib/RestApi';

const doLmsLogin = async customerPassword => {
    const { request } = Magento2;

    const data = {
        password: customerPassword
    };

    const reply = await request('/lms/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include'
    });

    return reply;
};

export default doLmsLogin;
