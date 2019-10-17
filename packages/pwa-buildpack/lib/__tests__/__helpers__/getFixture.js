const { join } = require('path');
const baseDir = join(__dirname, '..', '__fixtures__');
module.exports = fixtureName => join(baseDir, fixtureName);
