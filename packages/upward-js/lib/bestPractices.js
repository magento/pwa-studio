const connect = require('connect');
const shrinkRay = require('shrink-ray-current');
// TODO: node-helmet and any other zero-conf best practices should go here.
function bestPractices() {
    const bestPracticeMiddlewares = connect();
    bestPracticeMiddlewares.use(shrinkRay());
    return bestPracticeMiddlewares;
}

module.exports = bestPractices;
