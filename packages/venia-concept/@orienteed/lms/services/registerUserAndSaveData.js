import axios from 'axios';
import getToken from './getToken';
import getUserId from './getUserId';
import { v4 as uuidv4 } from 'uuid';

const registerUserAndSaveData = async (email, password, setMoodleTokenAndId, saveMoodleTokenAndId) => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'core_user_create_users',
        'users[0][username]': email.toLowerCase(),
        'users[0][firstname]': 'Magento',
        'users[0][lastname]': uuidv4(),
        'users[0][email]': email,
        'users[0][password]': password
    };

    return await axios
        .get(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, {
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
