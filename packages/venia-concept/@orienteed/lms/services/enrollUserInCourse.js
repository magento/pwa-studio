import axios from 'axios';

const enrollUserInCourse = async (userId, courseId) => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: process.env.LMS_API_KEY,
        wsfunction: 'enrol_manual_enrol_users',
        'enrolments[0][roleid]': 5,
        'enrolments[0][userid]': userId,
        'enrolments[0][courseid]': courseId
    };

    return await axios
        .get(`${process.env.LMS_URL}/webservice/rest/server.php`, {
            params: params
        })
        .then(coursesResponse => {
            return coursesResponse.data === null;
        })
        .catch(error => console.error(error));
};

export default enrollUserInCourse;
