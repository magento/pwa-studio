const { fixer: fixMarkdown, linter: lint } = require('./markdown-linter');
const process = require('process');
const path = require('path');

const filepath = process.argv[2];
const fullPath = path.join(path.dirname(__dirname), filepath);

console.log('\x1b[34m', 'Formatting: ', filepath, '\x1b[0m');

fixMarkdown(fullPath).then(() => {
    console.log(
        '\x1b[32m',
        'Complete!',
        '\x1b[33m',
        'Any remaining formatting issues will need manual fixing.\n',
        '\x1b[0m'
    );
    lint(fullPath);
});
