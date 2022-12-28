import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCourseDetails = async id => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/courses/details?id=${id}`, {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getCourseDetails;
