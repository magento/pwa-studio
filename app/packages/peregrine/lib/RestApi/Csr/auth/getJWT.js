import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getJWT = async (locale) => {
    const { request } = Magento2;

    const body ={'locale': locale}

    const reply = await request('/csr/api/v1/auth/chatbot', {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include'
    });

    return reply;
};

export default getJWT;