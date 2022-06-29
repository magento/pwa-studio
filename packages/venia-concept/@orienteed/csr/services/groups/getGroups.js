import axios from 'axios';

const getGroups = async () => {
    const csrUrl = process.env.CSR_URL;
    const csrToken = process.env.CSR_ADMIN_API_KEY;

    const headers = {
        Authorization: `Token token=${csrToken}`,
        'Content-Type': 'application/json'
    };

    return await axios
        .get(`${csrUrl}api/v1/groups/`, {
            headers: headers
        })
        .then(reply => {
            return reply.data;
        })
        .catch(error => console.error(error));
};

export default getGroups;
