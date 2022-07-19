import axios from 'axios';
import getToken from './getToken';
import getUserId from './getUserId';
import { v4 as uuidv4 } from 'uuid';

const registerUserAndSaveData = async (email, password, setMoodleTokenAndId) => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: process.env.LMS_API_KEY,
        wsfunction: 'core_user_create_users',
        'users[0][username]': email.toLowerCase(),
        'users[0][firstname]': 'Magento',
        'users[0][lastname]': uuidv4(),
        'users[0][email]': email,
        'users[0][password]': password
    };

    const saveMoodleTokenAndId = (token, id) => {
        localStorage.setItem('LMS_INTEGRATION_moodle_token', token);
        localStorage.setItem('LMS_INTEGRATION_moodle_id', id);
    };

    return await axios
        .get(`${process.env.LMS_URL}/webservice/rest/server.php`, {
            params: params
        })
        .then(res => {
            if (!res.data.hasOwnProperty('exception')) {
                // If not is an exception
                const [{ id, username }] = res.data;
                getToken(username, password).then(token => {
                    setMoodleTokenAndId({
                        variables: { moodle_token: token, moodle_id: id }
                    });
                    saveMoodleTokenAndId(token, id);
                });
            } else {
                // If is an exception
                const username = email.toLowerCase();
                getToken(username, password).then(token => {
                    getUserId(username).then(id => {
                        setMoodleTokenAndId({
                            variables: { moodle_token: token, moodle_id: id }
                        });
                        saveMoodleTokenAndId(token, id);
                    });
                });
            }
            return {};
        })
        .catch(error => console.error(error));
};

export default registerUserAndSaveData;
