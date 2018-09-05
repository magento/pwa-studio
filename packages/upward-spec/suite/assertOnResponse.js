const { inspect } = require('util');

module.exports = async (t, response, expected) => {
    const { status, headers, json, text } = expected;
    const headerObj = {};
    response.headers.forEach((value, name) => {
        headerObj[name] = value;
    });
    t.match(
        { status: response.status, headers: headerObj },
        { status, headers }
    );
    const body = await response.text();
    if (text) {
        t.match(body, text);
    }
    if (json) {
        let parsed;
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            t.fail(e.message);
        }
        t.match(parsed, json);
    }
};
