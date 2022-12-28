import { Magento2 } from '@magento/peregrine/lib/RestApi';

const enrollUser = async courseId => {
    const { request } = Magento2;

    const reply = await request(`/lms/api/v1/enrollment/enroll?courseId=${courseId}`, {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default enrollUser;
