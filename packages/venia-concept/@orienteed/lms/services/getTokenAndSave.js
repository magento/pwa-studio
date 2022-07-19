import axios from 'axios';

const getTokenAndSave = async (username, password, moodleId, updateTokenAndId) => {
    const params = {
        username: username.toLowerCase(),
        password: password,
        service: 'pruebas_2'
    };

    return await axios
        .get(`${process.env.LMS_URL}/login/token.php`, { params: params })
        .then(tokenResponse => {
            updateTokenAndId({
                variables: { moodle_token: tokenResponse.data.token, moodle_id: moodleId }
            });
            localStorage.setItem('LMS_INTEGRATION_moodle_token', tokenResponse.data.token);
            localStorage.setItem('LMS_INTEGRATION_moodle_id', moodleId);
        })
        .catch(error => console.error(error));
};

export default getTokenAndSave;
