// TODO: this will work when jest 22 comes out
//
// module.exports = {
//     projects: [
//         {
//             displayName: "theme",
//             browser: true,
//             verbose: true,
//             collectCoverage: true
//         },
//         {
//             displayName: "node-scripts",
//             browser: false,
//             testEnvironment: "node",
//             verbose: true,
//             collectCoverage: true
//         }
//     ]
// };

const conf = (module.exports = {
    verbose: true,
    collectCoverage: true
});
if (process.env.JEST_PROJECT === 'theme') {
    conf.browser = true;
} else if (process.env.JEST_PROJECT === 'node-scripts') {
    console.log('using node-scripts jest config');
    conf.browser = false;
    conf.testEnvironment = 'node';
    conf.collectCoverageFrom = ['lib/**/*.js'];
    // conf.transformIgnorePatterns = ["/node_modules/", "/lib/"];
}
