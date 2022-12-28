const middleware = require('./middleware');
const TagExtractor = require('./Utilities/TagExtractor');

module.exports = { middleware: middleware(), create: middleware, TagExtractor };
