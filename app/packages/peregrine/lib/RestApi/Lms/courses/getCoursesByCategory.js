import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getCoursesByCategory = async categoryId => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/courses/category?categoryId=${categoryId}`, {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getCoursesByCategory;
