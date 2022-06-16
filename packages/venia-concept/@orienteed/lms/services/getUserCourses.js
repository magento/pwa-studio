import axios from 'axios';

const getUserCourses = async (userMoodleToken, userMoodleId) => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: userMoodleToken,
        userid: userMoodleId,
        wsfunction: 'core_enrol_get_users_courses'
    };

    return await axios
        .get(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, {
            params: params
        })
        .then(coursesResponse => {
            return coursesResponse.data;
        })
        .catch(error => console.error(error));
};

export default getUserCourses;
