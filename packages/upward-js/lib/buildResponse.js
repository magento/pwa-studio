const debug = require('debug')('upward-js:buildResponse');
const ResolverVisitor = require('./ResolverVisitor');
const Context = require('./Context');

async function buildResponse(io, env, rootDefinition, request) {
    const response = new Map();
    debug('creating Context');
    const requestContext = Context.fromRequest(env, request);
    debug('creating ResolverVisitor');
    const visitor = new ResolverVisitor(io, rootDefinition, requestContext);
    debug('visiting for status, headers, and body');
    try {
        const [status, headers, body] = await Promise.all([
            visitor.downward('status').then(Number),
            visitor.downward('headers'),
            visitor.downward('body')
        ]);
        debug('successfully built response, %O', { status, headers, body });
        return { status, headers, body };
    } catch (e) {
        throw new Error(e.stack);
    }
}

module.exports = buildResponse;
