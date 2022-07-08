import axios from 'axios';

const getCourseDetails = async id => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: process.env.LMS_API_KEY,
        wsfunction: 'core_course_get_courses_by_field',
        field: 'id',
        value: id
    };

    return await axios
        .get(`${process.env.LMS_URL}/webservice/rest/server.php`, {
            params: params
        })
        .then(coursesResponse => {
            return coursesResponse.data;
        })
        .catch(error => console.error(error));
};

export default getCourseDetails;
