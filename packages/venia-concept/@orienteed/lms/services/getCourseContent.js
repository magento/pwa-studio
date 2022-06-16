import axios from 'axios';

const getCourseContent = async (id, token = 'af547e6e35fca251a48ff4bedb7f1298') => {
    const data = {
        moodlewsrestformat: 'json',
        wstoken: token,
        wsfunction: 'core_course_get_contents',
        courseid: id
    };

    return await axios
        .post(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, null, { params: data })
        .then(courseResponse => {
            return courseResponse.data;
        })
        .catch(error => console.error(error));
};

export default getCourseContent;
