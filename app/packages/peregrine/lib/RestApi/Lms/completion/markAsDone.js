import { Magento2 } from '@magento/peregrine/lib/RestApi';

const markAsDone = async courseModuleId => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/completion/done?courseModuleId=${courseModuleId}`, {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default markAsDone;
