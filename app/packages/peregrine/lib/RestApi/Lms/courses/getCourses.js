import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCourses = async () => {
    const { request } = Magento2;

    const reply = await request('/lms/api/v1/courses/', {
        method: 'GET',
        credentials: 'include'
    });

    return reply.courses.slice(1);
};

export default getCourses;
