import axios from 'axios';

const markAsDone = async (userId, courseModuleId) => {
    const data = {
        moodlewsrestformat: 'json',
        wstoken: process.env.LMS_API_KEY,
        wsfunction: 'core_completion_override_activity_completion_status',
        cmid: courseModuleId,
        newstate: 1,
        userid: userId
    };

    return await axios
        .post(`${process.env.LMS_URL}/webservice/rest/server.php`, null, { params: data })
        .then(courseResponse => {
            return courseResponse.data;
        })
        .catch(error => console.error(error));
};

export default markAsDone;
