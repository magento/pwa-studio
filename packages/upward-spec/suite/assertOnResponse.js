const { inspect } = require('util');

module.exports = async (t, response, expected) => {
    // lift up as useful a stack trace as possible for the most common case,
    // which is a server-side error at runtime for an unsupported scenario
    if (response.status >= 400 && expected.status !== response.status) {
        const errorText = await response.clone().text();
        let errors;
        try {
            errors = JSON.parse(errorText).errors;
        } catch (e) {}
        if (!errors || !Array.isArray(errors) || errors.length === 0) {
            return t.fail(
                `Error: Expected ${inspect(
                    expected
                )}, server responded with a NON-COMPLIANT ERROR: (Server errors should emit GraphQL-compliant error JSON.) Received status ${
                    response.status
                }: ${errorText}`
            );
        }
        return t.fail(
            'Server reported errors: ' +
                errors.map(({ message }, i) => `[Error ${i + 1}: ${message}]\t`)
        );
    }

    const responseHeaders = {};
    response.headers.forEach((value, name) => {
        responseHeaders[name] = value;
        responseHeaders[name.toLowerCase()] = value.toString();
    });

    t.equal(response.status, expected.status, `status code ${expected.status}`);

    Object.entries(expected.headers).forEach(([header, start]) => {
        const value = responseHeaders[header.toLowerCase()];
        if (!value) {
            t.fail(
                `header ${header} not present in ${inspect(responseHeaders)}`
            );
        } else {
            t.ok(value.startsWith(start), `header ${header} is ${value}`);
        }
    });
    try {
        const body = await response.clone().text();
        if (expected.text) {
            const msg = `body should match '${expected.text}': ${body}`;
            if (body.includes(expected.text)) {
                t.pass(msg);
            } else {
                t.fail(msg);
            }
        }
        if (expected.json) {
            let parsed;
            try {
                parsed = JSON.parse(body);
            } catch (e) {
                t.fail(e.message);
            }
            Object.entries(expected.json).forEach(([name, value]) =>
                t.equal(
                    value,
                    parsed[name],
                    `JSON ${name} === ${JSON.stringify(parsed[name])}`
                )
            );
        }
    } catch (e) {
        t.error(e);
    }
};
