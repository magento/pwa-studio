const path = require('path');
const linter = require('../markdown-linter').linter

const config = {
  basePath: path.join(__dirname, '../../src')
}

// Run linter
linter(path.join(config.basePath, 'technologies/versioning/index.md'));
