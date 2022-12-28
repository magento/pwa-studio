import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCourseContent = async (id, enrolled) => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/courses/content?id=${id}&enrolled=${enrolled.toString()}`, {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getCourseContent;
