import axios from 'axios';
const csrUrl = process.env.CSR_URL;
const csrToken = process.env.CSR_ADMIN_API_KEY;
console.log({ csrUrl, csrToken });

const createCustomer = async (firstName, lastName, email) => {
    const data = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        login: email,
        organization: 'B2BStore',
        roles: ['Customer']
    };
    return await axios
        .post(`https://demo-moodle.orienteed.com/webservice/rest/server.php`, null, { params: data })
        .then(courseResponse => {
            return courseResponse.data;
        })
        .catch(error => console.error(error));
};

export default createCustomer;
