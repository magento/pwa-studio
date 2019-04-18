const remark = require('remark');
const styleGuide = require('./style-guide');
const vfile = require('to-vfile');

const linter = filepath => {
    return vfile.read(filepath).then(vfile => {
        return remark()
            .use(styleGuide)
            .process(vfile);
    });
};

module.exports = linter;
