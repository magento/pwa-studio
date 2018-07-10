export default class M2ApiResponseError extends Error {
    constructor({ method, path, res, bodyText }, ...args) {
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
            `${method} ${path} responded ${res.status} ${
                res.statusText
            }: \n\n${body}`,
            ...args
        );
        Error.captureStackTrace(this, M2ApiResponseError);
        this.response = res;
        this.method = method;
        this.path = path;
    }
}
