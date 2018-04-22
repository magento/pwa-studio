const { basename } = require('path');
module.exports = function createStaticRootRoute(filepath) {
    const publicPath = '/' + basename(filepath);
    return (req, res, next) => {
        if (req.method === 'GET' && req.path === publicPath) {
            res.sendFile(filepath);
        } else {
            next();
        }
    };
};
