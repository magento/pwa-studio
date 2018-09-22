const debug = require('../../util/debug').makeFileLogger(__filename);
const https = require('https');
const { URL } = require('url');
const fetch = require('node-fetch');

module.exports = (domain, username, password) => {
    let authToken;

    const agent = new https.Agent({ rejectUnauthorized: false });

    const defaultHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    const addFetchOptions = (opts = {}) => {
        const headers = Object.assign(
            authToken ? { Authorization: `Bearer ${authToken}` } : {},
            defaultHeaders,
            opts.headers
        );
        const fetchOptions = Object.assign(
            { agent, credentials: 'include' },
            opts,
            { headers }
        );
        debug('made fetch options: %O', fetchOptions);
        return fetchOptions;
    };

    const restAPIBase = new URL('/rest/V1/', domain);
    const fetchREST = (path, options) => {
        const fullUrl = new URL(
            path.replace(/^\//, ''),
            restAPIBase
        ).toString();
        const fullOptions = addFetchOptions(options);
        debug(
            `placing REST API call to %s with options %o`,
            fullUrl,
            fullOptions
        );
        return fetch(fullUrl, fullOptions);
    };

    const getToken = async () => {
        const body = JSON.stringify({ username, password });
        debug(`getting admin token using ${body}`);

        const tokenResponse = await fetchREST('integration/admin/token', {
            method: 'POST',
            body,
            agent
        });

        debug(
            `tokenResponse ${tokenResponse.status} ${tokenResponse.statusText}`
        );

        const token = await tokenResponse.json();
        authToken = token;
        debug(`set authToken to %s`, token);
    };

    return async (pathname, fetchOptions) => {
        if (!authToken) {
            await getToken();
        }
        const fetchAuthorized = () =>
            fetchREST(pathname, addFetchOptions(fetchOptions));
        return fetchAuthorized().then(
            res =>
                res.statusCode === 401
                    ? getToken().then(fetchAuthorized)
                    : res.json()
        );
    };
};
