import { Magento2 } from '@magento/peregrine/lib/RestApi';

const doCsrLogout = async () => {
    const { request } = Magento2;

    const data = {};

    const reply = await request('/csr/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include'
    });

    return reply;
};

export default doCsrLogout;
