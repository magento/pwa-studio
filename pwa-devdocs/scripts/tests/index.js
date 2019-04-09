const path = require('path');
const linter = require('../markdown-linter').linter
const process = require('process');

const config = {
  basePath: path.join(__dirname, '../../src')
}

// If a single file is specified, only run tests on that file
const filepath = process.argv[2];
if(filepath){
  const fullPath = path.join(__dirname,'..','..', filepath)
  runTests(fullPath);
}
else {
// Run tests on all markdown files found under the configured directory
}

function runTests(filepath){
  // Run linter
  linter(filepath);
}
