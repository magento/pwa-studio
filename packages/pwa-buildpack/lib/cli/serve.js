const { resolve } = require('path');
const prettyLogger = require('../util/pretty-logger');
const serve = require('../Utilities/serve');

module.exports.command = 'serve <directory>';
module.exports.describe = 'starts a node server in staging mode';

module.exports.handler = async function buildpackCli({ directory }) {
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'test';
    }

    const projectRoot = resolve(directory);
    serve(projectRoot).catch(e => {
        prettyLogger.error(e.stack);
        throw new Error(e.message);
    });
};
