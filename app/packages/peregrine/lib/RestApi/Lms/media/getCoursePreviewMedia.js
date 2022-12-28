import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCoursePreviewMedia = async courseImageUri => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/media/course?uri=${courseImageUri}`, {
        method: 'GET',
        parseJSON: false,
        credentials: 'include'
    });

    return reply;
};

export default getCoursePreviewMedia;
