const remark = require('remark');
const styleGuide = require('./style-guide');
const vfile = require('to-vfile');
const jekyllLinkTokenizer = require('./tokenizers').jekyllLink

const linter = filepath => {
    return vfile.read(filepath).then(vfile => {
        return remark()
            .use(styleGuide)
            .use(jekyllLinkTokenizer)
            .process(vfile);
    });
};

module.exports = linter;
