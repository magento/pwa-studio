import axios from 'axios';

const getUserId = async username => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'core_user_get_users',
        'criteria[0][key]': 'username',
        'criteria[0][value]': username
    };

    return await axios
        .get(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, {
            params: params
        })
        .then(userResponse => {
            return userResponse.data.users[0].id;
        })
        .catch(error => console.error(error));
};

export default getUserId;
