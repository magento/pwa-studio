const { buildHTML } = require('./html');

// Match document type request (same as in venia-ui/upward.yml)
const isDocument = req =>
    !(
        /^\/health-check/.test(req.originalUrl) ||
        /^\/graphql/.test(req.originalUrl) ||
        /^\/(rest|media)(\/|$)/.test(req.originalUrl) ||
        /^\/(robots\.txt|favicon\.ico|manifest\.json)/.test(req.originalUrl) ||
        /\.(js|json|png|jpe?g|gif|svg|ico|css|txt|woff|woff2)/.test(
            req.originalUrl
        )
    );

module.exports = {
    isDocument,
    buildHTML
};
