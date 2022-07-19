import axios from 'axios';

const getCourseContent = async (id, token = process.env.LMS_API_KEY) => {
    const data = {
        moodlewsrestformat: 'json',
        wstoken: token,
        wsfunction: 'core_course_get_contents',
        courseid: id
    };

    return await axios
        .post(`${process.env.LMS_URL}/webservice/rest/server.php`, null, { params: data })
        .then(courseResponse => {
            return courseResponse.data;
        })
        .catch(error => console.error(error));
};

export default getCourseContent;
