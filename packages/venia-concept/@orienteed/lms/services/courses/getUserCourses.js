import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getUserCourses = async () => {
    const { request } = Magento2;

    const reply = await request('/lms/api/v1/courses/progress', {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getUserCourses;
