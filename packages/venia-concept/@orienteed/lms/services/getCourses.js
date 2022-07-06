import axios from 'axios';

const getCourses = async () => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: process.env.LMS_API_KEY,
        wsfunction: 'core_course_get_courses_by_field'
    };

    return await axios
        .get(`${process.env.LMS_URL}/webservice/rest/server.php`, {
            params: params
        })
        .then(coursesResponse => {
            return coursesResponse.data.courses.slice(1);
        })
        .catch(error => console.error(error));
};

export default getCourses;
