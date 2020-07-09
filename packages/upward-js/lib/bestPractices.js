const connect = require('connect');
const helmet = require('helmet');
let shrinkRay;

try {
    shrinkRay = require('shrink-ray-current');
} catch (error) {
    shrinkRay = false;
}

// TODO: node-helmet and any other zero-conf best practices should go here.
function bestPractices() {
    const bestPracticeMiddlewares = connect();
    bestPracticeMiddlewares.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    upgradeInsecureRequests: true
                }
            }
        })
    );

    try {
        bestPracticeMiddlewares.use(shrinkRay());
    } catch (e) {
        console.warn(
            `Cannot add compression middleware: dependency \`shrink-ray-current\` is not
installed or not compatible with this environment. Assets will be served uncompressed.

If possible, install additional tools to build NodeJS native dependencies:
https://github.com/nodejs/node-gyp#installation`
        );
    }

    return bestPracticeMiddlewares;
}

module.exports = bestPractices;
