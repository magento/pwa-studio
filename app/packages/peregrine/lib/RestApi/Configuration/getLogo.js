import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getLogo = async() => {
    const { request } = Magento2;

    const reply = await request('/logo', {
        method: 'GET',
        parseJSON: false,
    });

    return reply;
};

export default getLogo;