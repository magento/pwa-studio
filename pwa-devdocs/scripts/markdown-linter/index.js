const linter = require('./linter');
const fs = require('fs');
const report = require('vfile-reporter');

module.exports = {
    linter: filepath => {
        linter(filepath)
            .then(file => {
                console.log(report(file));
            })
            .catch(error => {
                console.log(error);
            });
    },
    fixer: filepath => {
        return linter(filepath)
            .then(file => {
                return fs.promises.writeFile(filepath, String(file), 'utf8');
            })
            .catch(error => {
                console.log(error);
            });
    }
};
