import axios from 'axios';

const getCourseDetails = async id => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'core_course_get_courses_by_field',
        field: 'id',
        value: id
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

export default getCourseDetails;
