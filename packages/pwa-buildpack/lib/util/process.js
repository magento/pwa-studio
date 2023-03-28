function isDevServer() {
    return process.argv.find(v => v.includes('webpack-dev-server'));
}

function isBundleAnalyzer() {
    return process.argv.find(v => v.includes('--profile'));
}

module.exports = {
    isDevServer,
    isBundleAnalyzer
};
