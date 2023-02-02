import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCourseModuleMedia = async courseModuleUri => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/media/resource?uri=${courseModuleUri}`, {
        method: 'GET',
        parseJSON: false,
        credentials: 'include'
    });

    return reply;
};

export default getCourseModuleMedia;
