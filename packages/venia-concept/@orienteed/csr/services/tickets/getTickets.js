import axios from 'axios';

const getTickets = async () => {
    const csrUrl = process.env.CSR_URL;
    const csrToken = process.env.CSR_ADMIN_API_KEY;

    const headers = {
        Authorization: `Token token=${csrToken}`,
        'Content-Type': 'application/json'
    };

    return await axios
        .get(`${csrUrl}api/v1/tickets/search?expand=true&page=1&per_page=8&query=postman1@postman.com&limit=10`, {
            headers: headers
        })
        .then(reply => {
            return reply.data;
        })
        .catch(error => console.error(error));
};

export default getTickets;
