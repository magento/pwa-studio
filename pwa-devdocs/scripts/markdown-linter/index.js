const linter = require('./linter');
const fs = require('fs');
const path = require('path');

linter(path.join(__dirname, '../../src/technologies/contribute/index.md'));
