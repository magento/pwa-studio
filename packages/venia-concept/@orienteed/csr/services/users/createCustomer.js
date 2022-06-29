import axios from 'axios';

const createCustomer = async (firstName, lastName, email) => {
    const csrUrl = process.env.CSR_URL;
    const csrToken = process.env.CSR_ADMIN_API_KEY;

    const body = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        login: email,
        organization: 'B2BStore',
        roles: ['Customer']
    };

    const headers = {
        Authorization: `Token token=${csrToken}`,
        'Content-Type': 'application/json'
    };

    return await axios
        .post(`${csrUrl}api/v1/users?expand=true`, body, { headers: headers })
        .then(reply => {
            return reply;
        })
        .catch(error => console.error(error));
};

export default createCustomer;
