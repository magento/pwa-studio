import axios from 'axios';

const unenrollUserFromCourse = async (userId, courseId) => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'enrol_manual_unenrol_users',
        'enrolments[0][roleid]': 5,
        'enrolments[0][userid]': userId,
        'enrolments[0][courseid]': courseId
    };

    return await axios
        .get(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, {
            params: params
        })
        .then(coursesResponse => {
            return coursesResponse.data === null;
        })
        .catch(error => console.error(error));
};

export default unenrollUserFromCourse;
