let report = require('vfile-reporter');
let remark = require('remark');
let styleGuide = require('./style-guide');
let vfile = require('to-vfile');

const linter = filepath => {
    return vfile.read(filepath).then(vfile => {
        return remark()
            .use(styleGuide)
            .process(vfile);
    });
};

module.exports = linter;
