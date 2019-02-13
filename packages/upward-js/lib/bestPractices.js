const connect = require('connect');
let shrinkRay;

try {
    shrinkRay = require('shrink-ray-current');
} catch (error) {
    shrinkRay = false;
}

// TODO: node-helmet and any other zero-conf best practices should go here.
function bestPractices() {
    const bestPracticeMiddlewares = connect();

    if (shrinkRay) {
        bestPracticeMiddlewares.use(shrinkRay());
    } else {
        console.warn(
            `Cannot add compression middleware: dependency \`shrink-ray-current\` is not
installed. Assets will be served uncompressed.

If possible, install additional tools to build NodeJS native dependencies:
https://github.com/nodejs/node-gyp#installation`
        );
    }

    return bestPracticeMiddlewares;
}

module.exports = bestPractices;
