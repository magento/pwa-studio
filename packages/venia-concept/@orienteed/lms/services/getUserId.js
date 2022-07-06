import axios from 'axios';

const getUserId = async username => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: process.env.LMS_API_KEY,
        wsfunction: 'core_user_get_users',
        'criteria[0][key]': 'username',
        'criteria[0][value]': username
    };

    return await axios
        .get(`${process.env.LMS_URL}/webservice/rest/server.php`, {
            params: params
        })
        .then(userResponse => {
            return userResponse.data.users[0].id;
        })
        .catch(error => console.error(error));
};

export default getUserId;
