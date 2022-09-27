import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCourseModuleMedia = async courseModuleId => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/media/?courseModuleId=${courseModuleId}`, {
        method: 'GET',
        parseJSON: false,
        credentials: 'include'
    });

    console.log(reply.blob());

    return reply.blob();
};

export default getCourseModuleMedia;
