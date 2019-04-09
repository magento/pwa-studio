let report = require('vfile-reporter');
let remark = require('remark');
let styleGuide = require('./style-guide');
let vfile = require('to-vfile');

const linter = filepath => {
  var file = remark()
    .use(styleGuide)
    .processSync(vfile.readSync(filepath));
  console.log(report(file)); 
}

module.exports = linter;
