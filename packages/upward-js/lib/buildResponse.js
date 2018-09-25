const debug = require('debug')('upward-js:buildResponse');
const { isPlainObject } = require('lodash');
const ResolverVisitor = require('./ResolverVisitor');
const Context = require('./Context');

async function buildResponse(io, env, rootDefinition, request) {
    debug('creating Context');
    const requestContext = Context.fromRequest(env, request);
    debug('creating ResolverVisitor');
    const visitor = new ResolverVisitor(io, rootDefinition, requestContext);
    debug('visiting for status, headers, and body');
    try {
        const responseData = await visitor.downward([
            'status',
            'headers',
            'body'
        ]);
        if (isPlainObject(responseData)) {
            debug('successfully built response, %O', responseData);
            return {
                status: Number(responseData.status),
                headers: responseData.headers,
                body: responseData.body
            };
        } else {
            debug('visitor returned request-handling middleware');
            return responseData;
        }
    } catch (e) {
        throw new Error(e.stack);
    }
}

module.exports = buildResponse;
