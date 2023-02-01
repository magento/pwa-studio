import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getStyles = async () => {
    const { request } = Magento2;

    const reply = await request('/css', {
        method: 'GET'
    });

    return reply;
};

export default getStyles;