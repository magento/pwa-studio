const fs = require('fs');
const path = require('path');
const linter = require('../markdown-linter').linter;
const process = require('process');

const config = {
    basePath: path.join(__dirname, '../../src')
};

// If a single file is specified, only run tests on that file
const filepath = process.argv[2];
if (filepath) {
    const fullPath = path.join(__dirname, '..', '..', filepath);
    lintFile(fullPath);
} else {
    lintDirectory(config.basePath);
}

// Run tests on all markdown files found under the specified directory
function lintDirectory(directoryPath) {
    fs.promises
        .readdir(directoryPath, { withFileTypes: true })
        .then(filenames => {
            filenames.forEach(file => {
                const fullPath = path.join(directoryPath, file.name);
                if (file.isDirectory()) {
                    lintDirectory(fullPath);
                } else if (file.isFile() && path.extname(fullPath) === '.md') {
                    lintFile(fullPath);
                }
            });
        });
}

// Run all tests on a single file
function lintFile(filepath) {
    // Run linter
    linter(filepath);
}
