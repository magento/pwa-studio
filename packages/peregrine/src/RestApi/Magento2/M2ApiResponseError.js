export default class M2ApiResponseError extends Error {
    constructor({ method, resourceUrl, response, bodyText }, ...args) {
        let body = ``;
        try {
            const { message, trace, ...rest } = JSON.parse(bodyText);
            if (message) {
                body += `Message:\n\n  ${message}\n`;
            }
            const addl = Object.entries(rest);
            if (addl.length > 0) {
                body += `\nAdditional info:\n\n${JSON.stringify(
                    rest,
                    null,
                    4
                )}\n\n`;
            }
            if (trace) {
                body += `Magento PHP stack trace: \n\n${trace}`;
            }
            body += '\n';
        } catch (e) {
            body = bodyText;
        }
        super(
            `${method} ${resourceUrl} responded ${response.status} ${
                response.statusText
            }: \n\n${body}`,
            ...args
        );
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, M2ApiResponseError);
        }
        this.response = response;
        this.method = method;
        this.resourceUrl = resourceUrl;
    }
}
