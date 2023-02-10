import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getLogo = async() => {
    const { request } = Magento2;

    console.log("in the getLogo")
    const reply = await request('/logo', {
        method: 'GET',
        parseJSON: false,
    });

    console.log("in the reply")
    console.log(reply)

    return reply;
};

export default getLogo;