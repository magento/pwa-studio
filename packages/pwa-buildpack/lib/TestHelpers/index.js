module.exports = {
    ...require('./testWebpackCompiler'),
    ...require('./evaluateScripts'),
    ...require('./testWebpackLoader'),
    ...require('./testFullBuild'),
    ...require('./testTargets/testTargets')
};
