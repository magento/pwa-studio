const path = require('path');
const debug = require('debug');
const root = path.resolve(__dirname, '../');
const pkg = require(path.resolve(root, '../package.json'));
const toolName = pkg.name.split('/').pop();
const makeTag = (...parts) => parts.join(':');

const taggedLogger = tag => {
    const logger = debug(tag);
    logger.errorMsg = msg => `[${tag}] ${msg}`;
    logger.sub = sub => taggedLogger(makeTag(tag, sub));
    return logger;
};
module.exports = {
    makeFileLogger(p) {
        const segments = path.relative(root, p).split(path.sep);
        const tip = segments[segments.length - 1];
        if (tip === 'index.js') {
            segments.pop();
        } else {
            segments[segments.length - 1] = tip.replace(
                /\.(?:mjs|js|jsx|ts|ts|node)$/,
                ''
            );
        }
        const tag = makeTag(toolName, ...segments);
        return taggedLogger(tag);
    }
};
