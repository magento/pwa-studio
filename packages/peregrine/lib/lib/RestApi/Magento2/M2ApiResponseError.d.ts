export default class M2ApiResponseError extends Error {
    constructor({ method, resourceUrl, response, bodyText }: {
        method: any;
        resourceUrl: any;
        response: any;
        bodyText: any;
    }, ...args: any[]);
    response: any;
    method: any;
    resourceUrl: any;
    baseMessage: any;
}
