const connect = require('connect');
let shrinkRay;

try {
    shrinkRay = require('shrink-ray-current');
} catch (error) {
    console.warn(
        'Missing dependency: `shrink-ray-current`. Ensure additional tools are installed: https://github.com/nodejs/node-gyp#installation'
    );
}

// TODO: node-helmet and any other zero-conf best practices should go here.
function bestPractices() {
    const bestPracticeMiddlewares = connect();

    if (shrinkRay) {
        bestPracticeMiddlewares.use(shrinkRay());
    }

    return bestPracticeMiddlewares;
}

module.exports = bestPractices;
