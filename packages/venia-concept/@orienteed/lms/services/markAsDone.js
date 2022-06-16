import axios from 'axios';

const markAsDone = async (userId, courseModuleId) => {
    const data = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'core_completion_override_activity_completion_status',
        cmid: courseModuleId,
        newstate: 1,
        userid: userId
    };

    return await axios
        .post(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, null, { params: data })
        .then(courseResponse => {
            return courseResponse.data;
        })
        .catch(error => console.error(error));
};

export default markAsDone;
